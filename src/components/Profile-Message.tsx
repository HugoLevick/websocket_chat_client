import ProfileMessageProps from "../props/profile-message-props";

function ProfileMessage({
  user,
  online,
  customClickEvent,
}: ProfileMessageProps) {
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
          {online ? (
            <>
              <i className="fa fa-circle online"></i> online{" "}
            </>
          ) : (
            <>
              <i className="fa fa-circle offline"></i> offline{" "}
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export default ProfileMessage;
