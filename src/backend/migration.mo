import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public type OldUserProfile = {
    name : Text;
    points : Nat;
  };

  public type OldRewardRequest = {
    id : Text;
    userId : Principal;
    rewardType : {
      #cash;
      #giftCard;
    };
    amount : Nat;
    status : {
      #pending;
      #approved;
      #rejected;
    };
  };

  public type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    advertisements : Map.Map<Text, {
      id : Text;
      title : Text;
      content : Text;
      pointsReward : Nat;
      active : Bool;
    }>;
    rewardRequests : Map.Map<Text, OldRewardRequest>;
    userWatchedAds : Map.Map<Principal, List.List<Text>>;
    nextRewardId : Nat;
  };

  public type NewUserProfile = {
    name : Text;
    points : Nat;
    upiId : ?Text;
  };

  public type NewRewardRequest = {
    id : Text;
    userId : Principal;
    rewardType : {
      #cash;
      #giftCard;
    };
    amount : Nat;
    status : {
      #pending;
      #approved;
      #rejected;
    };
    upiId : ?Text;
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    advertisements : Map.Map<Text, {
      id : Text;
      title : Text;
      content : Text;
      pointsReward : Nat;
      active : Bool;
    }>;
    rewardRequests : Map.Map<Text, NewRewardRequest>;
    userWatchedAds : Map.Map<Principal, List.List<Text>>;
    nextRewardId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_id, profile) {
        {
          profile with upiId = null;
        };
      }
    );
    let newRewardRequests = old.rewardRequests.map<Text, OldRewardRequest, NewRewardRequest>(
      func(_id, reward) {
        {
          reward with upiId = null;
        };
      }
    );
    {
      old with
      userProfiles = newUserProfiles;
      rewardRequests = newRewardRequests;
    };
  };
};
