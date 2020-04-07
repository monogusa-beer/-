'use strict';
{

	const numButtons = document.querySelectorAll(".number-button")
	const setButton = document.getElementById("setButton");
	const clearButton = document.getElementById("clearButton");
	const generateButton = document.getElementById("generateButton");
	const mainPanel = document.getElementById("mainPanel");

	class NumPanel {
		constructor(id) {
			this.element = document.getElementById(id);
			this.num = "";
			this.status;
			this.htmlClass = this.element.classList;
		}

		getElement() {
			return this.element;
		}

		getNum() {
			return this.num;
		}

		setNum(num) {
			this.num = num;
		}

		getStatus() {
			return this.status;
		}

		setInactive() {
			this.status = "inactive";
			this.num = "";
			this.element.textContent = "";
			if(this.htmlClass.contains("waiting")) {
				this.htmlClass.remove("waiting");
			}
			if(this.htmlClass.contains("active")) {
				this.htmlClass.remove("active");
			}
		}

		setWaiting() {
			this.status = "waiting";
			this.num = "";
			this.element.textContent = "|";
			if(!this.htmlClass.contains("waiting")) {
				this.htmlClass.add("waiting")
			}
			if(this.htmlClass.contains("active")) {
				this.htmlClass.remove("active");
			}
		}

		setActive() {
			this.status = "active";
			this.element.textContent = this.num;
			if(!this.htmlClass.contains("active"))
			this.htmlClass.add("active");
			if(this.htmlClass.contains("waiting")) {
				this.htmlClass.remove("waiting");
			}
		}

		setSet() {
			this.status ="set";
			this.num = Number(this.num);
			this.element.textContent = this.num;
			if(this.htmlClass.contains("waiting")) {
				this.htmlClass.remove("waiting");
			}
			if(this.htmlClass.contains("active")) {
				this.htmlClass.remove("active");
			}
		}

		inputNum(num) {
			if(this.num.length === 6) {
				return;
			}
			if(this.num === "0") {
				this.num = `${num}`;
				return;
			}
			this.num += num;
		};
	}

	const minPanel = new NumPanel("minPanel");
	minPanel.setWaiting();
	const maxPanel= new NumPanel("maxPanel");
	maxPanel.setInactive();

	numButtons.forEach((numButton,index) => {
		numButton.addEventListener("click", () => {
			switch(minPanel.getStatus()) {
				case "waiting":
					minPanel.inputNum(index);
					minPanel.setActive();
					break;
				case "active":
					minPanel.inputNum(index);
					minPanel.setActive();
					break;
			}
			switch(maxPanel.getStatus()) {
				case "waiting":
					maxPanel.inputNum(index);
					maxPanel.setActive();
					break;
				case "active":
					maxPanel.inputNum(index);
					maxPanel.setActive();
					break;
			}
		});
	});

	setButton.addEventListener('click', () => {
		if(minPanel.getStatus() === "active") {
			minPanel.setSet();
			maxPanel.setWaiting();
		}
		if(maxPanel.getStatus() === "active") {
			maxPanel.setSet();
			if(minPanel.getNum() <= maxPanel.getNum()) {
				generateButton.classList.add("active");
			}
		}
	});

	clearButton.addEventListener('click', () => {
		minPanel.setWaiting();
		maxPanel.setInactive();
		if(generateButton.classList.contains("active")) {
			generateButton.classList.remove("active");
		}
	});

	minPanel.element.addEventListener('click', () => {
		switch(maxPanel.getStatus()) {
			case "waiting":
				maxPanel.setInactive();
				minPanel.setWaiting();
				break;
			case "active":
				maxPanel.setSet();
				minPanel.setWaiting();
		}
	});

	maxPanel.element.addEventListener('click', () => {
		switch(minPanel.getStatus()) {
			case "waiting":
				minPanel.setNum("0");
				minPanel.setSet();
				maxPanel.setWaiting();
				break;
			case "active":
				minPanel.setSet();
				maxPanel.setWaiting();
				break;
		}
	});

	generateButton.addEventListener('click', () => {
		if(!generateButton.classList.contains("active")) {
			return;
		}
		let generateRandomNumber = function(min,max) {
			return Math.floor(Math.random() * (max + 1 - min)) + min;
		};
		let generatedNum = generateRandomNumber(minPanel.getNum(), maxPanel.getNum());
		mainPanel.textContent = generatedNum;
	});
}