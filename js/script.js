'use strict';
{
	const numButtons = document.querySelectorAll(".number-button")
	const clearButton = document.getElementById("clearButton");
	const setButton = document.getElementById("setButton");
	const generateButton = document.getElementById("generateButton");
	const mainPanel = document.getElementById("mainPanel");
	let minNum;
	let maxNum;

	const historyList = document.getElementById("historyList");
	let generateCount = 0;


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

	let checkNum = function() {
		minNum = Number(minPanel.element.textContent);
		maxNum = Number(maxPanel.element.textContent);
		if(minNum !== NaN && maxNum !== NaN && minNum < maxNum) {
			generateButton.classList.add("active");
		}
	}

	let generateRandomNumber = function(min,max) {
		return Math.floor(Math.random() * (max + 1 - min)) + min;
	};

	let setHistory = function(num,order) {
		let historyItem = document.createElement("div");
		let historyOrder = document.createElement("dt");
		let historyNumber = document.createElement("dd");
		historyItem.classList.add("history-list-item");
		historyOrder.classList.add("history-list-order");
		historyNumber.classList.add("history-list-number");
		historyOrder.textContent = order;
		historyNumber.textContent = num;
		historyItem.appendChild(historyOrder);
		historyItem.appendChild(historyNumber);
		historyList.appendChild(historyItem);
	}

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
			checkNum();
		});
	});

	clearButton.addEventListener('click', () => {
		minPanel.setWaiting();
		maxPanel.setInactive();
		if(generateButton.classList.contains("active")) {
			generateButton.classList.remove("active");
		}
		mainPanel.textContent = "乱数"
		generateCount = 0;
		while(historyList.firstChild) historyList.removeChild(historyList.firstChild);
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

	setButton.addEventListener('click', () => {
		if(minPanel.getStatus() === "active") {
			minPanel.setSet();
			maxPanel.setWaiting();
		}
		if(maxPanel.getStatus() === "active") {
			maxPanel.setSet();
		}
	});

	generateButton.addEventListener('click', () => {
		if(!generateButton.classList.contains("active")) {
			return;
		}
		minPanel.setSet();
		maxPanel.setSet();

		let generatedNum = generateRandomNumber(minNum, maxNum);
		mainPanel.textContent = generatedNum;
		generateCount ++;
		setHistory(generatedNum,generateCount);
	});
}