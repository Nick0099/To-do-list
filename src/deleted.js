const loadDeleted = () => {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const div = document.createElement('div');
    div.innerHTML = `
       <h2>Deleted</h2>
    `;
    content.appendChild(div);
};

export default loadDeleted;