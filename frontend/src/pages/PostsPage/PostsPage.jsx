import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavbarB from "../../components/NavbarB/NavbarB";
import PostsCreateForm from "../../components/PostsCreateForm/PostsCreateForm";
import PostsCard from "../../components/PostsCard/PostsCard";
import { FaPlusCircle } from "react-icons/fa";

const PostsPage = () => {
    document.body.style.backgroundColor = '#e6f2e6';
    const { groupId } = useParams(); 
    const [posts, setPosts] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [createdPost, setCreatedPost] = useState({ title: "", category: "", content: "", group_id: parseInt(groupId) });
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:8080/posts/search?query=${searchTerm}`);
            if (!response.ok) {
                throw new Error("Erro ao buscar posts");
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Erro ao buscar posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [searchTerm]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCreatedPost((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const userId = localStorage.getItem("userId"); 
        if (!userId) {
            alert("Usuário não autenticado!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/posts/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userId}`, 
                },
                body: JSON.stringify({
                    ...createdPost,
                    user_id: parseInt(userId), 
                    group_id: parseInt(groupId), 
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao criar o post");
            }

            alert("Post criado com sucesso!");
            fetchPosts(); 
            setCreatedPost({ title: "", category: "", content: "", group_id: parseInt(groupId) });
            setIsCreating(false);
        } catch (error) {
            console.error("Erro ao criar post:", error);
            alert("Erro ao criar o post.");
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <NavbarB />
            <input
                type="text"
                placeholder="Pesquisar posts..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control mb-3"
            />
            {isCreating ? (
                <PostsCreateForm
                    createdPost={createdPost}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                />
            ) : (
                <div>
                    <div className="d-flex flex-wrap justify-content-start">
                        {posts.map((post) => (
                            <div key={post.id} className="me-3 mb-3">
                                <PostsCard post={post} />
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-success mt-3" onClick={() => {
                        setCreatedPost({ title: "", category: "", content: "", group_id: parseInt(groupId) });
                        setIsCreating(true);
                    }}>
                        <FaPlusCircle className="me-2" />
                        Criar Novo Post
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostsPage;
