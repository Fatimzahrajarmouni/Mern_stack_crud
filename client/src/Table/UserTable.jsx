import React, { useState } from 'react'
import Table from '../Component/Table'
import AddUser from '../Component/AddUser'
import UpdatedUser from '../Component/UpdatedUser'
import DeletUser from '../Component/DeletUser'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function UserTable() {
    const [userId, setUserId] = useState()
    const [updatedUserId, setUpdatedUserId] = useState()
    console.log(updatedUserId)
    const [value, setValue] = useState({
        name: "",
        fathername: "",
        email: "",
        phone: ""
    })
    const deletuser = (userid) => {
        setUserId(userid)
    }
    const handleUserDelet = async () => {
        try {
            const DeletUser = await axios.delete(`http://localhost:8000/api/delete/${userId}`)
            const response = DeletUser.data
            if (response.success) {
                toast.success(response.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlechange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })

    }


    const UpadteUserData = (Updatedid) => {

        setUpdatedUserId(Updatedid)

    }
    const handleOnSubmit = async (e, file) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', value.name);
        formData.append('fathername', value.fathername);
        formData.append('email', value.email);
        formData.append('phone', value.phone);
        if (file) {
            formData.append('image', file);
        }
    
        try {
            const UpdatedUser = await axios.put(`http://localhost:8000/api/update/${updatedUserId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const response = UpdatedUser.data;
    
            if (response.success) {
                toast.success(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    return (
        <>
            <Table Deletuser={deletuser} UpdatedUser={UpadteUserData}></Table>

            <AddUser></AddUser>
            <UpdatedUser handleOnSubmit={handleOnSubmit} value={value} handlechange={handlechange}></UpdatedUser>
            <DeletUser handleUserDelet={handleUserDelet} ></DeletUser>




        </>
    )
}
