import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../App.css";
import csvIcon from "../assets/csv.png";
import excelIcon from "../assets/excel.png";
import jsonIcon from "../assets/json.png";

export default function Table({ Deletuser, UpdatedUser, Showuser }) {
    const [data, setData] = useState([]);
    const [sortAsc, setSortAsc] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null); 
    const tableRef = useRef();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:8000/api/get');
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    const handleShowUser = (userId) => {
        const user = data.users.find(user => user._id === userId);
        console.log("Selected User:", user); // Debugging
        setSelectedUser(user); // Met à jour l'état des détails de l'utilisateur
        Showuser(userId);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleSort = (column) => {
        const sortedData = [...data.users].sort((a, b) => {
            const first = a[column].toLowerCase();
            const second = b[column].toLowerCase();
            if (sortAsc) {
                return first < second ? -1 : 1;
            } else {
                return first > second ? -1 : 1;
            }
        });
        setData({ users: sortedData });
        setSortAsc(!sortAsc);
    };


    const toJSON = () => {
        const json = JSON.stringify(data.users, null, 4);
        downloadFile(json, 'json', 'users.json');
    };

    const toCSV = () => {
        const csvRows = [
            ['Image', 'Name', 'Nationality', 'Email', 'Phone'],
            ...data.users.map(user => [
                `http://localhost:8000/${user.image}`, 
                user.name, 
                user.nationality, 
                user.email, 
                user.phone
            ])
        ];
        const csv = csvRows.map(row => row.join(',')).join('\n');
        downloadFile(csv, 'csv', 'users.csv');
    };

    const toExcel = () => {
        const excelRows = [
            ['Image', 'Name', 'Nationality', 'Email', 'Phone'],
            ...data.users.map(user => [
                `http://localhost:8000/${user.image}`, 
                user.name, 
                user.nationality, 
                user.email, 
                user.phone
            ])
        ];
        const excel = excelRows.map(row => row.join('\t')).join('\n');
        downloadFile(excel, 'excel', 'users.xls');
    };

    const downloadFile = (data, fileType, fileName) => {
        const mimeTypes = {
            json: 'application/json',
            csv: 'text/csv',
            excel: 'application/vnd.ms-excel'
        };
        const a = document.createElement('a');
        a.href = `data:${mimeTypes[fileType]};charset=utf-8,${encodeURIComponent(data)}`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const filteredData = data.users?.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.nationality.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm) || 
        user.phone.toLowerCase().includes(searchTerm)
    );

    return (
        <div className='body'>
            <main className="table" id="customers_table" ref={tableRef}>
                <section className="table__header">
                    <h3 className='h3'>Manage Users</h3>
                    <div className="input-group">        
                        <input type="search" placeholder="Search Data..." onChange={handleSearch}/>
                    </div>
                    <div className="export__file">
                        <label htmlFor="export-file" className="export__file-btn" title="Export File"></label>
                        <input type="checkbox" id="export-file"/>
                        <div className="export__file-options">
                            <label>Export As &nbsp; &#10140;</label>
                            <label onClick={toJSON} id="toJSON">JSON <img src={jsonIcon} alt="JSON"/></label>
                            <label onClick={toCSV} id="toCSV">CSV <img src={csvIcon} alt="CSV"/></label>
                            <label onClick={toExcel} id="toEXCEL">EXCEL <img src={excelIcon} alt="Excel"/></label>
                        </div>
                    </div>
                    <button className="add-user-btn" data-bs-toggle="modal" data-bs-target="#addEmployeeModal">
                        <i className="material-icons">&#xE147;</i> Add New User
                    </button>
                </section>
                <section className="table__body">
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('image')}>Image</th>
                                <th onClick={() => handleSort('name')}>Name</th>
                                <th onClick={() => handleSort('nationality')}>Nationality</th>
                                <th onClick={() => handleSort('email')}>Email</th>
                                <th onClick={() => handleSort('phone')}>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData?.map((elem, index) => (
                                <tr key={index}>
                                    <td>
                                        {elem.image && <img src={`http://localhost:8000/${elem.image}`} alt="User" />}
                                    </td>
                                    <td>{elem.name}</td>
                                    <td>{elem.nationality}</td>
                                    <td>{elem.email}</td>
                                    <td>{elem.phone}</td>
                                    <td>
                                        <a href="#" className="editcursor-pointer" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" onClick={() => UpdatedUser(elem._id)}>
                                            <i className="material-icons" data-bs-toggle="tooltip" title="Edit">&#xE254;</i>
                                        </a>
                                        <a href="#" className="deletecursor-pointer" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" onClick={() => Deletuser(elem._id)}>
                                            <i className="material-icons" data-bs-toggle="tooltip" title="Delete">&#xE872;</i>
                                        </a>
                                        <a href="#" className="detailscursor-pointer" data-bs-toggle="modal" data-bs-target="#showUserModal" onClick={() => handleShowUser(elem._id)}>
                                            <i className="material-icons" data-bs-toggle="tooltip" title="Details">visibility</i>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>

            {/* Modal for showing user details */}
            {selectedUser && (
                <div className="modal fade" id="showUserModal" tabIndex="-1" aria-labelledby="showUserModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="showUserModalLabel">User Details</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Name:</strong> {selectedUser.name}</p>
                                <p><strong>Nationality:</strong> {selectedUser.nationality}</p>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Phone:</strong> {selectedUser.phone}</p>
                                {selectedUser.image && (
                                    <p><img src={`http://localhost:8000/${selectedUser.image}`} alt="User" style={{ maxWidth: '100%' }} /></p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
