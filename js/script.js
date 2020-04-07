'use strict';
{
	const numButtons = document.querySelectorAll(".number-button")
	const clearButton = document.getElementById("clearButton");
	const generateButton = document.getElementById("generateButton");
	const mainPanel = document.getElementById("mainPanel");
	let minNum;
	let maxNum;

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
		}

		setWaiting() {
			this.status = "waiting";
			this.num = "";
			this.element.textContent = "|";
			if(!this.htmlClass.contains("waiting")) {
				this.htmlClass.add("waiting")
			}
		}

		setActive() {
			this.status = "active";
			this.element.textContent = this.num;
			if(this.htmlClass.contains("waiting")) {
				this.htmlClass.remove("waiting");
			}
		}

		setSet() {
			this.status ="set";
			this.element.textContent = this.num;
			if(this.htmlClass.contains("waiting")) {
				this.htmlClass.remove("waiting");
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

			minNum = Number(minPanel.element.textContent);
			maxNum = Number(maxPanel.element.textContent);
			if(minNum !== NaN && maxNum !== NaN && minNum < maxNum) {
				generateButton.classList.add("active");
			}
		});
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
		let generatedNum = generateRandomNumber(minNum, maxNum);
		mainPanel.textContent = generatedNum;
	});
}