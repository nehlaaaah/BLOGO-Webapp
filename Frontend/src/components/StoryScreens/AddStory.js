import React, { useRef, useContext } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthContext } from "../../Context/AuthContext";
import '../../Css/AddStory.css';

const AddStory = () => {
    const { config } = useContext(AuthContext);
    const imageEl = useRef(null);
    const editorEl = useRef(null);
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const clearInputs = () => {
        setTitle('');
        setContent('');
        setImage('');
        editorEl.current.editor.setData('');
        imageEl.current.value = '';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("image", image);
        formData.append("content", content);

        try {
            await axios.post("/story/addstory", formData, config);
            setMessage('Story added successfully');
            clearInputs();
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Something went wrong');
            setTimeout(() => setMessage(''), 5000);
        }
    }

    return (
        <div className="addStory-page">
            <form onSubmit={handleSubmit} className="addStory-form">
                {message && <div className="message">{message}</div>}
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
                        toolbar: ['underline']
                    }}
                    onChange={(event, editor) => setContent(editor.getData())}
                    ref={editorEl}
                />
                <div className="StoryImageField">
                    <div className="txt">
                        {image ? image.name : "Include a high-quality image in your story."}
                    </div>
                    <input
                        type="file"
                        ref={imageEl}
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <button type="submit" className="addStory-btn">Publish</button>
            </form>
        </div>
    );
}

export default AddStory;
