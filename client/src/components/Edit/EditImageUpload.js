/* eslint-disable */
import styled from "styled-components";
import { BsImage } from "react-icons/bs";
import { useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { editImagesState } from "../../atoms/edit";
import { ImCancelCircle } from "react-icons/im";
import S3 from "react-aws-s3";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import axios from "axios";

window.Buffer = window.Buffer || require("buffer").Buffer;

const ProfileDeleteButton = styled(ImCancelCircle)`
  position: absolute;
  top: 7px;
  right: 7px;
`;

const PreviewImageContainter = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  & img {
    border-radius: 10px;
    padding: 1px;
    width: 95px;
    height: 95px;
    object-fit: cover;
  }
`;

const PreviewContainer = styled.div`
  width: 300px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border: dotted 1px gray;
  border-top: none;
`;

const ImageIcon = styled(BsImage)`
  opacity: ${(props) => (props.drag === "drag" ? "50%" : "70%")};
`;

const UploadContainer = styled.div`
  opacity: ${(props) => (props.drag === "drag" ? "70%" : "100%")};
  width: 300px;
  height: 300px;
  border: dotted 1px gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  & input {
    display: none;
  }
`;

const UploadButton = styled.button`
  width: 100%;
  position: absolute;
  font-size: 1em;
  font-weight: bold;
  text-align: center;
  bottom: 20px;
  text-decoration: underline;
  border: none;
  background-color: white;
`;

const DescText = styled.p`
  width: 100%;
  height: 50px;
  color: gray;
  font-size: 1em;
  text-align: center;
  bottom: 80px;
`;

const StyledText = styled.p`
  width: 100%;
  color: gray;
  font-size: 1em;
  text-align: center;
  bottom: 80px;
`;

export default function EditImageUpload() {
  const location = useLocation();
  const [images, setImages] = useRecoilState(editImagesState);
  const [drag, setDrag] = useState(false);
  const imageRef = useRef();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let imageFiles = e.dataTransfer.files;
    for (let i = 0; i < imageFiles.length; i++) {
      handleFile(imageFiles[i]);
    }
  };

  const handleClick = (e) => {
    let imageFiles = e.target.files;
    for (let i = 0; i < imageFiles.length; i++) {
      handleFile(imageFiles[i]);
    }
  };

  const { data } = useQuery(
    ["review", location.state.reviewId],
    () => {
      return axios.get(
        `${process.env.REACT_APP_BASE_API}/reviews/${location.state.reviewId}`
      );
    },
    {
      onSuccess: () => {
        setImages(data?.data.images);
      },
    }
  );

  const config = {
    bucketName: process.env.REACT_APP_BUCKET_NAME,
    region: process.env.REACT_APP_REGION,
    accessKeyId: process.env.REACT_APP_ACCESS,
    secretAccessKey: process.env.REACT_APP_SECRET,
  };

  const handleFile = (file) => {
    const ReactS3Client = new S3(config);
    const fileName = file.name + uuidv4();

    ReactS3Client.uploadFile(file, fileName)
      .then((data) => {
        setImages([...images, data.location]);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (index) => {
    const deletedImages = [];
    for (let i = 0; i < images.length; i++) {
      if (i === index) continue;
      else deletedImages.push(images[i]);
    }
    setImages([...deletedImages]);
  };
  return (
    <>
      <DescText>사진을 업로드 해주세요.</DescText>
      <UploadContainer
        onDragEnter={() => setDrag(true)}
        onDragLeave={() => setDrag(false)}
        onDragOver={handleDragOver}
        onDrop={(e) => {
          handleDrop(e);
          setDrag(false);
        }}
      >
        <ImageIcon
          drag={drag ? "drag" : null}
          size={50}
          color="black"
        ></ImageIcon>
        <StyledText>여기에 사진을 놓아주세요.</StyledText>
        <UploadButton onClick={() => imageRef.current.click()}>
          기기에서 업로드
        </UploadButton>
        <input
          ref={imageRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleClick}
        />
      </UploadContainer>
      <PreviewContainer>
        {images.map((image, index) => {
          return (
            <PreviewImageContainter key={index}>
              <ProfileDeleteButton
                color="black"
                onClick={() => {
                  handleDelete(index);
                }}
              />
              <img src={image} alt="미리보기" />
            </PreviewImageContainter>
          );
        })}
      </PreviewContainer>
    </>
  );
}
