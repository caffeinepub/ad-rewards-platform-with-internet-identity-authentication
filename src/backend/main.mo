import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Run migration on upgrade
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type UserId = Principal;

  public type UserProfile = {
    name : Text;
    points : Nat;
    upiId : ?Text;
  };

  public type RewardType = {
    #cash;
    #giftCard;
  };

  public type RewardStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type RewardRequest = {
    id : Text;
    userId : UserId;
    rewardType : RewardType;
    amount : Nat;
    status : RewardStatus;
    upiId : ?Text;
  };

  public type Advertisement = {
    id : Text;
    title : Text;
    content : Text;
    pointsReward : Nat;
    active : Bool;
  };

  public type PlatformStats = {
    totalUsers : Nat;
    totalPointsIssued : Nat;
    totalRewardRequests : Nat;
  };

  // State
  var userProfiles = Map.empty<Principal, UserProfile>();
  var advertisements = Map.empty<Text, Advertisement>();
  var rewardRequests = Map.empty<Text, RewardRequest>();
  var userWatchedAds = Map.empty<Principal, List.List<Text>>();
  var totalPointsIssued = 0;
  var nextRewardId : Nat = 0;

  // UPI Management
  public shared ({ caller }) func setCallerUpiId(upiId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set UPI ID");
    };

    let profile = userProfiles.get(caller);
    let updatedProfile = switch (profile) {
      case (null) { { name = ""; points = 0; upiId = ?upiId } };
      case (?p) { { p with upiId = ?upiId } };
    };
    userProfiles.add(caller, updatedProfile);
    Runtime.trap("upiSetSuccess");
  };

  public query ({ caller }) func getCallerUpiId() : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view UPI ID");
    };

    userProfiles.get(caller).map(func(p) { p.upiId }).flatten();
  };

  public query ({ caller }) func getUserUpiId(user : Principal) : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view UPI ID");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own UPI ID");
    };

    userProfiles.get(user).map(func(p) { p.upiId }).flatten();
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let existingProfile = userProfiles.get(caller);
    let updatedProfile = switch (existingProfile) {
      case (?existing) {
        {
          profile with
          points = existing.points;
          upiId = existing.upiId;
        };
      };
      case (null) { profile };
    };

    userProfiles.add(caller, updatedProfile);
  };

  // User Functions - Public access (including guests)
  public query ({ caller }) func getAds() : async [Advertisement] {
    advertisements.values().toArray();
  };

  public query ({ caller }) func getActiveAds() : async [Advertisement] {
    let activeAds = List.empty<Advertisement>();
    for ((_, ad) in advertisements.entries()) {
      if (ad.active) { activeAds.add(ad) };
    };
    activeAds.toArray();
  };

  public shared ({ caller }) func watchAd(adId : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can watch ads");
    };

    let ad = advertisements.get(adId);
    switch (ad) {
      case (null) { Runtime.trap("Advertisement not found") };
      case (?advertisement) {
        if (not advertisement.active) { Runtime.trap("Advertisement is not active") };

        let watchedAds = switch (userWatchedAds.get(caller)) {
          case (null) { List.empty<Text>() };
          case (?ads) { ads };
        };

        for (watchedAdId in watchedAds.values()) {
          if (watchedAdId == adId) { Runtime.trap("Ad already watched") };
        };

        let profile = userProfiles.get(caller);
        let updatedProfile = switch (profile) {
          case (null) {
            {
              name = "";
              points = advertisement.pointsReward;
              upiId = null;
            };
          };
          case (?p) {
            { p with points = p.points + advertisement.pointsReward };
          };
        };

        userProfiles.add(caller, updatedProfile);
        watchedAds.add(adId);
        userWatchedAds.add(caller, watchedAds);
        totalPointsIssued += advertisement.pointsReward;

        updatedProfile.points;
      };
    };
  };

  // Reward Redemption
  public shared ({ caller }) func redeemReward(rewardType : RewardType, amount : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can redeem rewards");
    };

    switch (rewardType) {
      case (#cash) {
        if (amount < 50_000) {
          // Minimum 50 INR
          Runtime.trap("Minimum redemption amount for cash is 50 INR");
        };
        let hasUpiId = userProfiles.get(caller).map(func(p) { p.upiId }).flatten();

        switch (hasUpiId) {
          case (null) { Runtime.trap("Missing UPI - Cash redemption requires a UPI ID") };
          case (?upiId) {
            if (upiId.size() < 2) { Runtime.trap("Missing UPI - Cash redemption requires a UPI ID") };
          };
        };
      };
      case (#giftCard) {
        if (amount < 500_000) {
          Runtime.trap("Minimum redemption amount for gift cards is 500 INR");
        };
      };
    };

    let profile = userProfiles.get(caller);
    switch (profile) {
      case (null) { Runtime.trap("User profile not found") };
      case (?p) {
        if (p.points < amount) { Runtime.trap("Insufficient points") };

        let updatedProfile = { p with points = p.points - amount };
        userProfiles.add(caller, updatedProfile);

        let requestId = nextRewardId.toText();
        nextRewardId += 1;

        let request : RewardRequest = {
          id = requestId;
          userId = caller;
          rewardType = rewardType;
          amount = amount;
          status = #pending;
          upiId = p.upiId;
        };

        rewardRequests.add(requestId, request);
        requestId;
      };
    };
  };

  public query ({ caller }) func getCallerRewardRequests() : async [RewardRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reward requests");
    };

    let userRequests = List.empty<RewardRequest>();
    for ((_, request) in rewardRequests.entries()) {
      if (request.userId == caller) {
        userRequests.add(request);
      };
    };
    userRequests.toArray();
  };

  // Admin Functions - Ad Management
  public shared ({ caller }) func createAd(title : Text, content : Text, pointsReward : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create ads");
    };

    let adId = "ad_".concat(advertisements.size().toText());
    let ad : Advertisement = {
      id = adId;
      title;
      content;
      pointsReward;
      active = true;
    };

    advertisements.add(adId, ad);
    adId;
  };

  public shared ({ caller }) func updateAd(
    adId : Text,
    title : Text,
    content : Text,
    pointsReward : Nat,
    active : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update ads");
    };

    let existingAd = advertisements.get(adId);
    switch (existingAd) {
      case (null) { Runtime.trap("Advertisement not found") };
      case (?_) {
        let updatedAd : Advertisement = {
          id = adId;
          title;
          content;
          pointsReward;
          active;
        };
        advertisements.add(adId, updatedAd);
      };
    };
  };

  public shared ({ caller }) func deleteAd(adId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete ads");
    };

    advertisements.remove(adId);
  };

  // Admin Functions - Payout Management
  public shared ({ caller }) func approveRewardRequest(requestId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve rewards");
    };

    let request = rewardRequests.get(requestId);
    switch (request) {
      case (null) { Runtime.trap("Reward request not found") };
      case (?req) {
        let updatedRequest : RewardRequest = {
          req with status = #approved;
        };
        rewardRequests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func rejectRewardRequest(requestId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject rewards");
    };

    let request = rewardRequests.get(requestId);
    switch (request) {
      case (null) { Runtime.trap("Reward request not found") };
      case (?req) {
        let updatedRequest : RewardRequest = {
          req with status = #rejected;
        };
        rewardRequests.add(requestId, updatedRequest);
      };
    };
  };

  public query ({ caller }) func getAllRewardRequests() : async [RewardRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all reward requests");
    };

    rewardRequests.values().toArray();
  };

  public query ({ caller }) func getPendingRewardRequests() : async [RewardRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending reward requests");
    };

    let pendingRequests = List.empty<RewardRequest>();
    for ((_, request) in rewardRequests.entries()) {
      if (request.status == #pending) {
        pendingRequests.add(request);
      };
    };
    pendingRequests.toArray();
  };

  public query ({ caller }) func getStats() : async PlatformStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view platform stats");
    };

    {
      totalUsers = userProfiles.size();
      totalPointsIssued;
      totalRewardRequests = rewardRequests.size();
    };
  };

  // Payout Verification
  public shared ({ caller }) func verifyCashPayoutReceived(requestId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can verify payouts");
    };

    let request = rewardRequests.get(requestId);
    switch (request) {
      case (null) {
        Runtime.trap("Reward request not found");
      };
      case (?r) {
        if (r.userId != caller) {
          Runtime.trap("Unauthorized: Can only verify your own payouts");
        };

        let updatedRequest = {
          r with status = #approved;
        };
        rewardRequests.add(requestId, updatedRequest);
      };
    };
  };
};
