import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import Loader from '../GeneralScreens/Loader';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import { AiOutlineUpload } from 'react-icons/ai';
import '../../Css/EditStory.css';

const EditStory = () => {
    const { config } = useContext(AuthContext);
    const slug = useParams().slug;
    const imageEl = useRef(null);
    const [loading, setLoading] = useState(true);
    const [story, setStory] = useState({});
    const [image, setImage] = useState('');
    const [previousImage, setPreviousImage] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getStoryInfo = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/story/editStory/${slug}`, config);
                setStory(data.data);
                setTitle(data.data.title);
                setContent(data.data.content);
                setImage(data.data.image);
                setPreviousImage(data.data.image);
                setLoading(false);
            } catch (error) {
                navigate("/");
            }
        };
        getStoryInfo();
    }, [slug, config, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("image", image);
        formData.append("previousImage", previousImage);

        try {
            await axios.put(`/story/${slug}/edit`, formData, config);
            setMessage('Story edited successfully');
            setTimeout(() => navigate('/'), 2500);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Something went wrong');
            setTimeout(() => setMessage(''), 4500);
        }
    };

    return (
        <>
            {loading ? <Loader /> : (
                <div className="editStory-page">
                    <form onSubmit={handleSubmit} className="editStory-form">
                        {message && <div className={`message ${message.includes('error') ? 'error_msg' : 'success_msg'}`}>{message}</div>}

                        <input
                            type="text"
                            required
                            placeholder="Title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />

                        <CKEditor
                            editor={ClassicEditor}
                            config={{
                                toolbar: ['underline'] // Adjusted toolbar
                            }}
                            onChange={(event, editor) => setContent(editor.getData())}
                            data={content}
                        />

                        <div className="currentlyImage">
                            <div className="absolute">Currently Image</div>
                            <img src={`http://localhost:5000/storyImages/${previousImage}`} alt="Story Image" />
                        </div>
                        <div className="StoryImageField">
                            <AiOutlineUpload />
                            <div className="txt">
                                {image === previousImage ? "Change the image in your story" : image.name}
                            </div>
                            <input
                                type="file"
                                ref={imageEl}
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>

                        <button type="submit" className="editStory-btn">Edit Story</button>
                    </form>
                </div>
            )}
        </>
    );
};

export default EditStory;
