let activeState = 'all';
let data = [];
let theme = localStorage.getItem('theme');
const root = document.documentElement;

console.log(data);
const mainContent = document.querySelector('.content');
const menus = document.querySelectorAll('.menu button');
const themeBtn = document.querySelector('.toggle-theme-btn');
themeBtn.addEventListener('click', () => toggleTheme());

if (theme) {
	root.dataset.theme = theme;
	if (theme == 'light') {
		const img = document.createElement('img');
		img.setAttribute('src', 'assets/images/icon-moon.svg');
		themeBtn.appendChild(img);
	} else {
		const img = document.createElement('img');
		img.setAttribute('src', 'assets/images/icon-sun.svg');
		themeBtn.appendChild(img);
	}
} else {
	if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		root.dataset.theme = 'dark';
	}
}

async function loadData() {
	let res = await fetch('data.json');
	data = await res.json();
	renderData(data);
}

function renderData(data) {
	mainContent.innerHTML = '';
	data.map((d) => {
		const article = document.createElement('article');
		article.classList.add('content-item');
		const figure = document.createElement('figure');
		const img = document.createElement('img');
		figure.classList.add('content-img');

		const figCaption = document.createElement('figcaption');
		const h2 = document.createElement('h2');
		const p = document.createElement('p');
		figCaption.appendChild(h2);
		figCaption.appendChild(p);
		figure.appendChild(img);
		figure.appendChild(figCaption);
		article.appendChild(figure);
		``;

		img.setAttribute('src', d.logo);
		img.setAttribute('alt', d.description);
		h2.innerText = d.name;
		p.innerHTML = d.description;

		const contentFooter = document.createElement('section');
		contentFooter.classList.add('content-footer');
		const removeBtn = document.createElement('button');
		removeBtn.classList.add('btn-remove');
		removeBtn.innerText = 'Remove';
		const toggleBtn = document.createElement('button');
		toggleBtn.classList.add('btn-toggle');
		toggleBtn.setAttribute('id', 'on');
		const circleDiv = document.createElement('div');
		circleDiv.classList.add('circle');
		if (d.isActive) {
			toggleBtn.setAttribute('id', 'on');
		} else {
			toggleBtn.setAttribute('id', 'off');
		}
		toggleBtn.addEventListener('click', () => activateBtn(d.name));
		removeBtn.addEventListener('click', () => removeItem(d.name));
		toggleBtn.appendChild(circleDiv);
		contentFooter.appendChild(removeBtn);
		contentFooter.appendChild(toggleBtn);
		article.appendChild(contentFooter);
		mainContent.appendChild(article);
	});
}

function activateBtn(name) {
	const getData = data.find((d) => d.name == name);
	getData.isActive = !getData.isActive;
	checkActiveStatus(data);
}

function removeItem(name) {
	data = data.filter((d) => d.name != name);
	checkActiveStatus(data);
}

function checkActiveStatus(data) {
	if (activeState == 'active') {
		renderData(data.filter((d) => d.isActive == true));
	} else if (activeState == 'inactive') {
		renderData(data.filter((d) => d.isActive == false));
	} else {
		renderData(data);
	}
}

function toggleTheme() {
	const current = root.dataset.theme === 'dark' ? 'light' : 'dark';
	themeBtn.innerHTML = '';
	if (current === 'light') {
		const img = document.createElement('img');
		img.setAttribute('src', 'assets/images/icon-moon.svg');
		themeBtn.appendChild(img);
	} else {
		const img = document.createElement('img');
		img.setAttribute('src', 'assets/images/icon-sun.svg');
		themeBtn.appendChild(img);
	}
	root.dataset.theme = current;
	localStorage.setItem('theme', current);
}
menus.forEach((m) =>
	m.addEventListener('click', () => {
		activeState = m.getAttribute('name');
		checkActiveStatus(data);

		menus.forEach((m) => m.setAttribute('id', ''));
		m.setAttribute('id', 'active');
	})
);
window.addEventListener('DOMContentLoaded', loadData);
