import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import axios from "axios";

const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1MzU5OWYzYS1mMmY3LTQ2MmUtOTE5OC0wNzcyNGZjZjQxZDciLCJlbWFpbCI6ImRhNzY3ODBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjdmNjY0NmIwZWI3YzIyZDBjY2UyIiwic2NvcGVkS2V5U2VjcmV0IjoiMzEzN2Y4ZjhkNmRjNDY4NzhmZGY0MWI0OTdhNmNjYWZkNWJhMTljMGIwMmFhZGEwNWM3YzA3OTQ1ZjY5YTZmMSIsImlhdCI6MTcwNjkzNDY4MH0.1tBLHmVSkGAga2RFEzD5gH46PAM30yGReu1wqPSMmLY`;

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const formData = new FormData();

    formData.append("file", file);

    const metadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });

    formData.append("pinataOptions", options);
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      setImage(
        `https://harlequin-fashionable-marten-862.mypinata.cloud/ipfs/${res.data.IpfsHash}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const createNFT = async () => {
    if (!image || !price || !name || !description) return;
    try {
      const data = JSON.stringify({
        pinataContent: {
          name: `${name}`,
          price: `${price}`,
          description: `${description}`,
          image: `${image}`,
        },
        pinataMetadata: {
          name: "NFT Metadata",
        },
      });

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: JWT,
          },
          body: data,
        }
      );
      const resData = await res.json();
      console.log("Metadata uploaded, CID:", resData.IpfsHash);
      mintThenList( resData.IpfsHash)
    } catch (error) {
      console.log(error);
    }
  };
  const mintThenList = async (result) => {
    const uri = `https://harlequin-fashionable-marten-862.mypinata.cloud/ipfs/${result}`;
    await (await nft.mint(uri)).wait();
    const id = await nft.tokenCount();
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItems(nft.address, id, listingPrice)).wait();
  };
  
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
              />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
            {image && (
              <img src={image} alt="important" height={100} width={100} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Create;
