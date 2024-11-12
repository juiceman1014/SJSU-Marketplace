import "./ListingPage.css";
import { useState, useEffect } from "react";
import { auth, db, storage } from "../../configuration/firebase-config.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  ref as dbRef,
  push,
  get,
  child,
  ref,
  set,
  remove,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

const ListingPage = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentUserID, setCurrentUserID] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserID(user.uid);
      } else {
        setCurrentUserID(null);
      }
    });

    return () => unsubscribe;
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const itemsRef = dbRef(db, "items");
        const snapshot = await get(itemsRef);
        if (snapshot.exists()) {
          const items = Object.values(snapshot.val());
          setListings(items);
          setFilteredListings(items);
        }
      } catch (error) {
        if (!currentUserID) {
          navigate("/");
          setTimeout(() => {
            alert("Please log in to view listings!");
          }, 100);
        } else {
          alert("Failed to fetch listings" + error);
        }
      }
    };

    fetchListings();
  }, [listings]);

  useEffect(() => {
    if(searchInput.trim() === ""){
      setFilteredListings(listings);
    }else{
      const filtered = listings.filter((item) => 
        item.title.toLowerCase().includes(searchInput.toLowerCase())
     );
     setFilteredListings(filtered);
    }
  }, [searchInput, listings]);

  const navigate = useNavigate();

  const navigateToMessagePage = async (sellerID) => {
    const buyerID = auth.currentUser.uid;
    const conversationID = [buyerID, sellerID].sort().join("_");

    const conversationRef = ref(db, `conversations/${conversationID}`);
    const snapshot = await get(conversationRef);

    if (!snapshot.exists()) {
      await set(conversationRef, {
        participants: {
          [buyerID]: true,
          [sellerID]: true,
        },
        lastMessageSnippet: "",
        lastMessageTimestamp: Date.now(),
      });

      await set(
        ref(db, `users/${buyerID}/conversations/${conversationID}`),
        true
      );
      await set(
        ref(db, `users/${sellerID}/conversations/${conversationID}`),
        true
      );
    }

    navigate(`/message/${buyerID}/${sellerID}/${conversationID}`);
  };

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
      const newItemRef = await push(itemRef);
      const newItem = {
        ID: newItemRef.key,
        userID,
        userName,
        imageUrl,
        title,
        category,
        condition,
        description,
        price,
      };

      await set(newItemRef, newItem);

      setListings((prevListings) => [...prevListings, newItem]);
      closeModal();
      alert("Item listed successfully!");
    } catch (error) {
      alert("Failed to list item: " + error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteListing = async (itemID) => {
    try {
      const itemRef = dbRef(db, `items/${itemID}`);
      await remove(itemRef);
      setListings((prevListings) =>
        prevListings.filter((item) => item.id !== itemID)
      );
      alert("Listing deleted successfully!");
    } catch (error) {
      alert("Failed to delete listing: " + error);
    }
  };

  return (
    <div>
      <div className = "filter-options">
          <input
          type = "text"
          placeholder="Search for items here"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          />
       </div>
      <div className="listing-container">
        <div>
          <h2>Listings</h2>
          <button onClick={openModal}>Click here to start listing!</button>

          <div className="item-list">
            {filteredListings.map((item, index) => (
              <div key={index} className="item">
                <h3>{item.title}</h3>
                {item.imageUrl && (
                  <img src={item.imageUrl} className="listing-image"></img>
                )}
                <p>Category: {item.category}</p>
                <p>Condition: {item.condition}</p>
                <p>Description: {item.description}</p>
                <p>Price: {item.price}</p>
                <p>Seller: {item.userName}</p>
                {item.userID === auth.currentUser.uid ? (
                  <button onClick={() => handleDeleteListing(item.ID)}>
                    Delete Listing
                  </button>
                ) : (
                  <button onClick={() => navigateToMessagePage(item.userID)}>
                    Contact Seller
                  </button>
                )}
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
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="School Supplies">School Supplies</option>
                <option value="Furniture">Furniture</option>
                <option value="Technology">Technology</option>
                <option value="Other">Other</option>
              </select>
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
