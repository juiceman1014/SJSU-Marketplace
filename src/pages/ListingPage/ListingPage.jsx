import "./ListingPage.css";
import Header from "../../components/Header/Header";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchListings = async() => {
      try{
        const itemsRef = dbRef(db, "items");
        const snapshot = await get(itemsRef);
        if(snapshot.exists()){
          const items = Object.values(snapshot.val());
          setListings(items);
        }
      }catch(error){
        alert("Failed to fetch listings" + error);
      }
    };

    fetchListings();
  }, []);

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
      console.log(error);
      return "Anonymous";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try{
      const userID = auth.currentUser.uid;
      const userName = await fetchUsername(userID);

      let imageUrl = "";

      if(image){
        const storagePath = `images/${userID}/${image.name}`;
        const imageRef = storageRef(storage, storagePath);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
    

    const itemRef = dbRef(db, "items");
    const newItem = {
      userID,
      userName,
      imageUrl,
      title,
      category,
      condition,
      description,
      price,
    };

    await push(itemRef, newItem);

    setListings((prevListings) => [...prevListings, newItem]);
    closeModal();
    alert("Item listed successfully!");
  }catch (error){
    alert("Failed to list item: " + error);
  } finally{
    setUploading(false);
  }
};

  return (
    <div>
      <Header />
      <div className="listing-container">
        <div>
          <h>Listings</h>
          <button onClick = {openModal}>Click here to start listing!</button>

          <div className = "item-list">
            {listings.map((item, index) => (
              <div key = {index} className = "item">
                <h>{item.title}</h>
                {item.imageUrl && <img src = {item.imageUrl}></img>}
                <p>Category: {item.category}</p>
                <p>Condition: {item.condition}</p>
                <p>Description: {item.description}</p>
                <p>Price: {item.price}</p>
                <p>Seller: {item.userName}</p>
              </div>
            ))}
          </div>


        </div>
      </div>
    </div>
  );
};

export default ListingPage;
