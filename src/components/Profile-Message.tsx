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
          <span
            className={online ? "online" : "offline"}
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
            }}
          ></span>{" "}
          {online ? "online" : "offline"}
        </div>
      </div>
    </li>
  );
}

export default ProfileMessage;
