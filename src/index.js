import './styles.css';
import loadHome from './home.js';
import loadProjects from './projects.js';
import loadImportant from './important.js';
import loadDeleted from './deleted.js';

loadHome();

document.getElementById('homeBtn').addEventListener('click', loadHome);
document.getElementById('prjBtn').addEventListener('click', loadProjects);
document.getElementById('impBtn').addEventListener('click', loadImportant);
document.getElementById('deletedBtn').addEventListener('click', loadDeleted);