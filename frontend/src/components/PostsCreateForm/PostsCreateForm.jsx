import React, { useState } from 'react';
import PropTypes from "prop-types";

const PostsCreateForm = ({ createdPost, handleInputChange, handleSave, handleCancel }) => {
  const handleSavePost = async () => {
    console.log("Dados do post antes de enviar:", createdPost);

    const token = localStorage.getItem("userId");

    if (!token) {
        console.error("Token de autenticação não encontrado");
        alert("Você precisa estar autenticado para criar um post.");
        return;
    }

    if (!createdPost.group_id) {
        console.error("Group ID ausente");
        alert("O group ID é necessário.");
        return;
    }

    const groupId = parseInt(createdPost.group_id, 10);

    if (isNaN(groupId)) {
        console.error("O group_id não é um número válido");
        alert("O group ID fornecido não é válido.");
        return;
    }

    console.log("group_id enviado para o backend:", groupId);

    const postData = {
        title: createdPost.title,
        content: createdPost.content,
        category: createdPost.category,
        user_id: token,
        group_id: groupId,  
    };

    try {
        const response = await fetch("http://localhost:8080/posts/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Erro ao criar post:", error);
            alert("Erro ao criar o post. Tente novamente.");
            return;
        }

        alert("Post criado com sucesso!");
    } catch (error) {
        console.error("Erro ao criar post:", error);
        alert("Ocorreu um erro ao tentar criar o post.");
    }
};


    return (
        <div className="card-container mt-4 mx-auto shadow-lg">
            <h4 className="card-title text-success">Criar Novo Post</h4>

            <form>
                <div className="mb-3">
                    <label className="form-label">Nome do Post</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={createdPost.title}
                        onChange={handleInputChange}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Categoria</label>
                    <input
                        type="text"
                        className="form-control"
                        name="category"
                        value={createdPost.category}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Conteúdo</label>
                    <textarea
                        className="form-control"
                        name="content"
                        value={createdPost.content || ""}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-success" onClick={handleSavePost}>
                        Criar Post
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleCancel}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

PostsCreateForm.propTypes = {
    createdPost: PropTypes.shape({
        title: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        content: PropTypes.string, 
        user_id: PropTypes.number.isRequired, 
        group_id: PropTypes.number.isRequired, 
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
};

export default PostsCreateForm;
