import "./ListingPage.css";
import Header from "../../components/Header/Header";
import { auth, db, storage } from "../../configuration/firebase-config.js";
import { ref as dbRef, push, get, child } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Modal from "react-modal";

const ListingPage = () => {
  const [listings, setListings] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category,setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const fetchUsername = async (userID) => {
    try{
      const userRef = dbRef(db, `users/${userID}`);
      const snapshot = await get(child(userRef, "username"));
      if(snapshot.exists()){
        return snapshot.val();
      }else{
        return "Anonymous";
      }
    } catch (error){
      return "Anonymous";
    }
  };



  return (
    <div>
      <Header />
      <div className="listing-container">
        <div>Listings</div>
      </div>
    </div>
  );
};

export default ListingPage;
