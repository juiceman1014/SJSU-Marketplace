import "./ListingPage.css";
import Header from "../../components/Header/Header";
import { useState, useEffect } from "react";
import { auth, db, storage } from "../../configuration/firebase-config.js";
import { ref as dbRef, push, get, child } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import Modal from "react-modal";

const ListingPage = () => {
  const [listings, setListings] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const itemsRef = dbRef(db, "items");
        const snapshot = await get(itemsRef);
        if (snapshot.exists()) {
          const items = Object.values(snapshot.val());
          setListings(items);
        }
      } catch (error) {
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
    try {
      const userRef = dbRef(db, `users/${userID}`);
      const snapshot = await get(child(userRef, "username"));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return "Anonymous";
      }
    } catch (error) {
      console.log(error);
      return "Anonymous";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const userID = auth.currentUser.uid;
      const userName = await fetchUsername(userID);

      let imageUrl = "";

      if (image) {
        const storagePath = `images/${userID}/${image.name}`;
        const imageRef = storageRef(storage, storagePath);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log("This is the imageURL: ", imageUrl);
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
    } catch (error) {
      alert("Failed to list item: " + error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="listing-container">
        <div>
          <h2>Listings</h2>
          <button onClick={openModal}>Click here to start listing!</button>

          <div className="item-list">
            {listings.map((item, index) => (
              <div key={index} className="item">
                <h3>{item.title}</h3>
                {item.imageUrl && <img src={item.imageUrl} className = "listing-image"></img>}
                <p>Category: {item.category}</p>
                <p>Condition: {item.condition}</p>
                <p>Description: {item.description}</p>
                <p>Price: {item.price}</p>
                <p>Seller: {item.userName}</p>
                <button onClick = {() => navigateToMessagePage(item.userID)}>Contact Seller</button>
              </div>
            ))}
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className="modal-content"
          >
            <h2>Create your listing here!</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              ></input>
              <input
                type="text"
                placeholder="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              ></input>
              <input
                type="text"
                placeholder="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              ></input>
              <textarea
                placeholder="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
              <input
                type="number"
                placeholder="Listed Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              ></input>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              ></input>
              <button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Submit"}
              </button>
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
