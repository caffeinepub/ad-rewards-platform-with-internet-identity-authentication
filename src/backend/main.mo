import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type UserId = Principal;

  public type UserProfile = {
    name : Text;
    points : Nat;
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
  };

  public type Advertisement = {
    id : Text;
    title : Text;
    content : Text;
    pointsReward : Nat;
    active : Bool;
  };

  // State storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let advertisements = Map.empty<Text, Advertisement>();
  let rewardRequests = Map.empty<Text, RewardRequest>();
  let userWatchedAds = Map.empty<Principal, List.List<Text>>();
  var nextRewardId : Nat = 0;

  // User Profile Functions (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    
    // Preserve existing points when updating profile
    let existingProfile = userProfiles.get(caller);
    let updatedProfile = switch (existingProfile) {
      case (?existing) {
        {
          name = profile.name;
          points = existing.points;
        };
      };
      case null {
        profile;
      };
    };
    
    userProfiles.add(caller, updatedProfile);
  };

  // User Functions - Ad Viewing and Points
  public query ({ caller }) func getActiveAds() : async [Advertisement] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view ads");
    };

    let activeAds = List.empty<Advertisement>();
    for ((_, ad) in advertisements.entries()) {
      if (ad.active) {
        activeAds.add(ad);
      };
    };
    activeAds.toArray();
  };

  public shared ({ caller }) func watchAd(adId : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can watch ads");
    };

    let ad = advertisements.get(adId);
    switch (ad) {
      case null {
        Runtime.trap("Advertisement not found");
      };
      case (?advertisement) {
        if (not advertisement.active) {
          Runtime.trap("Advertisement is not active");
        };

        // Check if user already watched this ad
        let watchedAds = switch (userWatchedAds.get(caller)) {
          case null { List.empty<Text>() };
          case (?ads) { ads };
        };

        for (watchedAdId in watchedAds.toArray().values()) {
          if (watchedAdId == adId) {
            Runtime.trap("Ad already watched");
          };
        };

        // Award points
        let profile = userProfiles.get(caller);
        let updatedProfile = switch (profile) {
          case null {
            {
              name = "";
              points = advertisement.pointsReward;
            };
          };
          case (?p) {
            {
              name = p.name;
              points = p.points + advertisement.pointsReward;
            };
          };
        };

        userProfiles.add(caller, updatedProfile);
        
        // Mark ad as watched
        watchedAds.add(adId);
        userWatchedAds.add(caller, watchedAds);

        updatedProfile.points;
      };
    };
  };

  public query ({ caller }) func getPoints() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view points");
    };

    let profile = userProfiles.get(caller);
    switch (profile) {
      case null { 0 };
      case (?p) { p.points };
    };
  };

  // User Functions - Reward Redemption
  public shared ({ caller }) func redeemReward(rewardType : RewardType, amount : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can redeem rewards");
    };

    let profile = userProfiles.get(caller);
    switch (profile) {
      case null {
        Runtime.trap("User profile not found");
      };
      case (?p) {
        if (p.points < amount) {
          Runtime.trap("Insufficient points");
        };

        // Deduct points
        let updatedProfile = {
          name = p.name;
          points = p.points - amount;
        };
        userProfiles.add(caller, updatedProfile);

        // Create reward request
        let requestId = nextRewardId.toText();
        nextRewardId += 1;

        let request : RewardRequest = {
          id = requestId;
          userId = caller;
          rewardType = rewardType;
          amount = amount;
          status = #pending;
        };

        rewardRequests.add(requestId, request);
        requestId;
      };
    };
  };

  public query ({ caller }) func getUserRewards() : async [RewardRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view rewards");
    };

    let userRewardsList = List.empty<RewardRequest>();
    for ((_, request) in rewardRequests.entries()) {
      if (request.userId == caller) {
        userRewardsList.add(request);
      };
    };
    userRewardsList.toArray();
  };

  // Admin Functions - Ad Management
  public shared ({ caller }) func createAd(title : Text, content : Text, pointsReward : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create ads");
    };

    let adId = "ad_".concat(advertisements.size().toText());
    let ad : Advertisement = {
      id = adId;
      title = title;
      content = content;
      pointsReward = pointsReward;
      active = true;
    };

    advertisements.add(adId, ad);
    adId;
  };

  public shared ({ caller }) func updateAd(adId : Text, title : Text, content : Text, pointsReward : Nat, active : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update ads");
    };

    let existingAd = advertisements.get(adId);
    switch (existingAd) {
      case null {
        Runtime.trap("Advertisement not found");
      };
      case (?_) {
        let updatedAd : Advertisement = {
          id = adId;
          title = title;
          content = content;
          pointsReward = pointsReward;
          active = active;
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

  public query ({ caller }) func getAllAds() : async [Advertisement] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all ads");
    };

    let allAds = List.empty<Advertisement>();
    for ((_, ad) in advertisements.entries()) {
      allAds.add(ad);
    };
    allAds.toArray();
  };

  // Admin Functions - Payout Management
  public query ({ caller }) func getAllRewardRequests() : async [RewardRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all reward requests");
    };

    let allRequests = List.empty<RewardRequest>();
    for ((_, request) in rewardRequests.entries()) {
      allRequests.add(request);
    };
    allRequests.toArray();
  };

  public query ({ caller }) func getPendingRewardRequests() : async [RewardRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending requests");
    };

    let pendingRequests = List.empty<RewardRequest>();
    for ((_, request) in rewardRequests.entries()) {
      switch (request.status) {
        case (#pending) {
          pendingRequests.add(request);
        };
        case _ {};
      };
    };
    pendingRequests.toArray();
  };

  public shared ({ caller }) func approveRewardRequest(requestId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve rewards");
    };

    let request = rewardRequests.get(requestId);
    switch (request) {
      case null {
        Runtime.trap("Reward request not found");
      };
      case (?req) {
        let updatedRequest : RewardRequest = {
          id = req.id;
          userId = req.userId;
          rewardType = req.rewardType;
          amount = req.amount;
          status = #approved;
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
      case null {
        Runtime.trap("Reward request not found");
      };
      case (?req) {
        // Refund points to user
        let userProfile = userProfiles.get(req.userId);
        switch (userProfile) {
          case (?profile) {
            let updatedProfile = {
              name = profile.name;
              points = profile.points + req.amount;
            };
            userProfiles.add(req.userId, updatedProfile);
          };
          case null {};
        };

        let updatedRequest : RewardRequest = {
          id = req.id;
          userId = req.userId;
          rewardType = req.rewardType;
          amount = req.amount;
          status = #rejected;
        };
        rewardRequests.add(requestId, updatedRequest);
      };
    };
  };

  // Admin Functions - Analytics
  public query ({ caller }) func getUserAnalytics() : async {
    totalUsers : Nat;
    totalPoints : Nat;
    totalRewardRequests : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };

    var totalUsers = 0;
    var totalPoints = 0;
    for ((_, profile) in userProfiles.entries()) {
      totalUsers += 1;
      totalPoints += profile.points;
    };

    let totalRewardRequests = rewardRequests.size();

    {
      totalUsers = totalUsers;
      totalPoints = totalPoints;
      totalRewardRequests = totalRewardRequests;
    };
  };
};
