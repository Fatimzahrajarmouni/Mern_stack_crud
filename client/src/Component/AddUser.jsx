import React, { useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AddUser() {
    const [value, setValue] = useState({
        name: '',
        nationality: '',
        email: '',
        phone: '',
    });

    const [file, setFile] = useState(null);
    const CloseRef = useRef();

    const handleOnChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', value.name);
        formData.append('nationality', value.nationality);
        formData.append('email', value.email);
        formData.append('phone', value.phone);
        if (file) {
            formData.append('image', file);
        }

        try {
            const response = await axios.post('http://localhost:8000/api/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                CloseRef.current.click(); // Closes the modal
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to add user');
        }
    };

    return (
        <>
            <div id="addEmployeeModal" className="modal fade" tabIndex="-1" aria-labelledby="addEmployeeModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h4 className="modal-title" id="addEmployeeModalLabel">Add User</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={CloseRef}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" value={value.name} name="name" onChange={handleOnChange} className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label>Nationality</label>
                                    <input type="text" value={value.nationality} name="nationality" onChange={handleOnChange} className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={value.email} name="email" onChange={handleOnChange} className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="text" value={value.phone} name="phone" onChange={handleOnChange} className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label>Image</label>
                                    <input type="file" onChange={handleFileChange} className="form-control" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
