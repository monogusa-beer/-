'use strict';
{
	const numButtons = document.querySelectorAll(".number-button")
	const clearButton = document.getElementById("clearButton");
	const setButton = document.getElementById("setButton");
	const generateButton = document.getElementById("generateButton");
	const mainPanel = document.getElementById("mainPanel");
	const historyList = document.getElementById("historyList");
	const duplicationToggle = document.getElementById("duplicationToggle")
	let minNum;
	let maxNum;
	let generateCount = 0;
	let numList = [];

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
			if(this.htmlClass.contains("waiting")) {
				this.htmlClass.remove("waiting");
			}
			if(!this.htmlClass.contains("active")) {
				this.htmlClass.add("active")
			}
		}

		setSet() {
			this.status ="set";
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
		numList = [];
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

	duplicationToggle.addEventListener('click', () => {
		if (generateCount > 0) {
			mainPanel.textContent = "乱数"
			generateCount = 0;
			while(historyList.firstChild) historyList.removeChild(historyList.firstChild);
			numList = [];
		}
	});

	generateButton.addEventListener('click', () => {
		if(!generateButton.classList.contains("active")) {
			return;
		}
		minPanel.setSet();
		maxPanel.setSet();

		if (duplicationToggle.checked) {
			if(numList[0] === "finish") {
				mainPanel.textContent = "finish";
				return;
			}
			if(numList.length === 0) {
				for (let i = minNum; i <= maxNum; i++) {
					numList.push(i);
				}
			}
			let r = Math.floor(Math.random() * numList.length);
			let generatedNum = numList[r];
			mainPanel.textContent = generatedNum;
			numList.splice(r,1);
			generateCount ++;
			setHistory(generatedNum,generateCount);
			if(numList.length === 0) {
				numList.push("finish");
			}
		} else {
			let generatedNum = generateRandomNumber(minNum, maxNum);
			mainPanel.textContent = generatedNum;
			generateCount ++;
			setHistory(generatedNum,generateCount);
		}
	});
}