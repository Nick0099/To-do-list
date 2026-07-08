const loadHome = () => {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const div = document.createElement('div');
    div.innerHTML = `
       <h2>Home</h2>
       <p>All Tasks</p>
       
    `;
    content.appendChild(div);
};

export default loadHome;