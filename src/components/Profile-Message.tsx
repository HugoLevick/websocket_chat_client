import ProfileMessageProps from "../props/profile-message-props";

function ProfileMessage({ user, customClickEvent }: ProfileMessageProps) {
  if (!user.profilePictureUrl)
    user.profilePictureUrl =
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

  return (
    <li
      className="clearfix"
      onClick={() => {
        return customClickEvent(user);
      }}
    >
      <img src={user.profilePictureUrl} alt="avatar" className="pfp pfp-m" />
      <div className="about">
        <div className="name">{user.name}</div>
        <div className="status">
          {user.status === "online" ? (
            <>
              <i className="fa fa-circle online"></i> online
            </>
          ) : (
            <>
              <i className="fa fa-circle offline"></i> offline
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export default ProfileMessage;
