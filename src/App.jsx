import { useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  const [image, setImage] = useState(null);
  const ENDPOINT_API = "http://localhost:5000";

  const handleUpload = async (event) => {
    // setImageWarning(false)

    try {
      if (!event.target.files[0]) {
        return;
      }
      const file = event.target.files[0];
      console.log("file: ", file);

      const maxSize = 3 * 1024 * 1024; // 3MB in bytes
      if (file && file.size > maxSize) {
        event.target.value = null;
        return;
      }

      // setImageLoading(true);
      // setImageLoadingPercent(0);
      let fileData = event.target.files[0];
      let fileType = event.target.files[0].type;
      console.log("fileData: ", fileData);

      const responseUrl = await axios({
        method: "post",
        url: `${ENDPOINT_API}/generatePresignedUrl`,
        // headers: getTokken,
        data: {
          type: fileType,
        },
      });

      console.log("responseURL: ", responseUrl?.data);

      await axios({
        method: "put",
        url: responseUrl.data.url,
        data: fileData,
        headers: {
          "Content-Type": " file/*; image/*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        }
      });
      // setImageLoading(false);
      // onChange(responseUrl?.data?.filename);
      console.log("responseUrl: ", responseUrl?.data?.filename);
      setImage(responseUrl?.data?.filename);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <label htmlFor="imageUpload">Select an image:</label>
      <input
        type="file"
        id="imageUpload"
        onChange={handleUpload}
        accept="image/*" // This ensures only image files can be selected
      />
      {image && (
        <div>
          <img src={image} alt="" />
        </div>
      )}
    </div>
  )
}

export default App