import "./ProfilePage.css";
import Header from "../../components/Header/Header";

const ProfilePage = () => {
  return (
    <div>
      <Header />
      <div className="profile-container">
        <header>Profile</header>

        <form className="profile-form">
          <input placeholder="Username"></input>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
