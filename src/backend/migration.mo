import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  type UserId = Principal;

  type UserProfile = {
    name : Text;
    points : Nat;
    upiId : ?Text;
  };

  type RewardType = {
    #cash;
    #giftCard;
  };

  type RewardStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type RewardRequest = {
    id : Text;
    userId : UserId;
    rewardType : RewardType;
    amount : Nat;
    status : RewardStatus;
    upiId : ?Text;
  };

  type Advertisement = {
    id : Text;
    title : Text;
    content : Text;
    pointsReward : Nat;
    active : Bool;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    advertisements : Map.Map<Text, Advertisement>;
    rewardRequests : Map.Map<Text, RewardRequest>;
    userWatchedAds : Map.Map<Principal, List.List<Text>>;
    nextRewardId : Nat;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    advertisements : Map.Map<Text, Advertisement>;
    rewardRequests : Map.Map<Text, RewardRequest>;
    userWatchedAds : Map.Map<Principal, List.List<Text>>;
    totalPointsIssued : Nat;
    nextRewardId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    { old with totalPointsIssued = 0 };
  };
};
