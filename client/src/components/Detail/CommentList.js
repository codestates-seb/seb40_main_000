/* eslint-disable */
import styled from "styled-components";
import Comment from "./Comment";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const CommentListContainer = styled.ul`
  width: 100%;
  padding: 10px;
`;

export default function CommentList() {
  const { id } = useParams();

  const { data } = useQuery(["comments"], () => {
    return axios.get(
      `${process.env.REACT_APP_BASE_API}/reviews/${id}/comments/`
    );
  });

  return (
    <CommentListContainer>
      {data?.data.map((comment) => {
        return <Comment key={comment.id} comment={comment} reviewId={id} />;
      })}
    </CommentListContainer>
  );
}
