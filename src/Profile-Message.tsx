import ProfileMessageI from "./interfaces/profile-message.interface";
function ProfileMessage(data: ProfileMessageI) {
  if (!data.user.profilePictureUrl)
    data.user.profilePictureUrl =
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
  return (
    <>
      <li className="clearfix">
        <img
          src={data.user.profilePictureUrl}
          alt="avatar"
          className="pfp pfp-m"
        />
        <div className="about">
          <div className="name">{data.user.name}</div>
          <div className="status">
            {data.user.status === "online" ? (
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
    </>
  );
}

export default ProfileMessage;
