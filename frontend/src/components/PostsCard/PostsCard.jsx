import React from "react";
import PropTypes from "prop-types";

const PostsCard = ({ post }) => {
    const formattedDate = new Date(post.created_at).toLocaleDateString();

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title text-success">{post.title}</h5>
                <p className="card-category">{post.category}</p>
                <hr />
                <p className="card-text">{post.content}</p> 
                <hr />
                <p className="card-text"><small className="text-muted">Criado em: {formattedDate}</small></p>
                <hr />
                <p className="card-text"><small className="text-muted">Criado por: {post.created_by}</small></p>
            </div>
        </div>
    );
};

PostsCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string, 
        category: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        created_by: PropTypes.number.isRequired,
    }).isRequired,
};

export default PostsCard;
