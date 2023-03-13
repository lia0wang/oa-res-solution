import React, { useState, useEffect } from "react";
import axios from "axios";

const Contacts = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        axios
            .get("https://jsonplaceholder.typicode.com/users")
            .then((response) => setContacts(response.data))
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className="contacts">
            <h2>Contacts</h2>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>UserName</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Website</th>
                    <th>Company</th>
                    <th>Address</th>
                </tr>
                </thead>
                <tbody>
                {contacts.map((contact) => (
                    <tr key={contact.id}>
                        <td>{contact.name}</td>
                        <td>{contact.username}</td>
                        <td><a href={"mailto:" + contact.email}>{contact.email}</a></td>
                        <td>{contact.phone}</td>
                        <td><a href={"http://" + contact.website}>{contact.website}</a></td>
                        <td>{contact.company.name}</td>
                        <td>{
                            contact.address.suite + ", " +
                            contact.address.street + ", " +
                            contact.address.city + ", " +
                            contact.address.zipcode
                        }</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Contacts;
