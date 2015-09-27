import {Item} from './data';
import * as request from 'request';

export default class Analyzer {
	
	sample: any[][];
	
	categories;
	
	constructor() {
		this.sample = [["Cereals","Bakery","Meats","Poultry","Fish","Eggs","Dairy","Fruits","Vegetables","Sugars/sweets","Fats/Oils","Grains","Total","OB"],[5,4,5,5,0,3,4,6,5,0,2,7,46,0],[3,7,2,1,8,7,3,1,1,3,4,0,40,0],[0,4,3,8,0,3,4,6,7,2,0,4,41,0],[1,1,0,2,10,0,7,3,0,6,0,4,34,0],[4,0,5,4,4,3,4,7,6,0,2,3,42,1],[3,2,4,4,0,0,0,4,2,4,0,3,26,1],[0,5,4,6,0,3,4,6,5,0,2,4,39,1],[0,0,0,2,0,0,0,0,1,0,0,2,5,1],[3,0,5,4,0,3,4,5,4,0,3,5,36,1],[0,2,0,0,0,1,0,2,0,2,0,0,7,1],[0,2,3,0,0,0,0,0,2,0,2,0,9,1],[4,3,5,6,0,3,4,6,6,2,4,4,47,1],[0,3,3,4,4,3,3,0,0,0,0,0,20,1],[0,0,3,0,0,0,0,5,4,0,0,3,15,1],[5,3,4,3,5,3,3,4,5,0,0,5,40,1],[0,0,3,5,6,3,0,0,0,2,0,0,19,1],[6,1,0,4,3,7,1,9,4,2,1,0,38,0],[0,7,8,6,9,5,0,9,8,7,6,5,70,0],[3,0,4,5,6,7,9,5,1,0,9,0,49,0],[2,2,0,9,8,0,10,10,0,3,2,4,50,0],[3,3,5,4,3,1,0,9,8,2,1,4,43,0],[12,8,7,4,0,3,9,8,4,1,7,8,71,0],[0,0,0,3,0,0,0,0,2,0,0,3,8,1],[2,6,7,7,9,6,3,5,7,0,0,3,55,1],[0,0,3,0,1,2,0,0,1,0,0,2,9,0],[3,10,5,7,2,7,4,5,5,3,4,8,63,0],[5,2,5,7,2,7,6,4,5,2,0,5,50,0],[3,2,3,4,2,4,6,7,5,2,4,5,47,0],[1,3,5,4,6,8,8,6,5,4,3,6,59,0],[2,0,3,0,0,0,0,0,7,0,0,0,12,1],[4,2,5,6,3,8,6,5,3,3,0,2,47,1],[2,3,0,0,0,0,3,3,0,0,0,0,11,1],[5,2,5,7,2,9,6,5,4,4,1,6,56,1],[0,2,0,0,0,0,0,3,0,2,4,2,13,1],[2,4,5,4,5,7,5,4,3,1,0,0,40,0],[3,4,3,1,3,2,4,4,3,3,4,3,37,0],[6,0,8,0,7,5,0,6,2,0,9,0,43,0],[7,1,0,8,0,1,3,5,3,5,0,6,39,0],[5,6,2,5,6,2,2,5,5,7,2,3,50,1],[0,0,4,0,0,3,0,0,0,1,0,0,8,1],[5,2,0,9,1,0,3,3,5,0,7,8,43,1],[3,3,1,9,8,6,3,1,0,9,0,9,52,1],[5,1,3,8,6,8,5,3,0,1,1,1,42,1],[2,1,2,1,2,2,4,5,6,5,3,2,35,1],[9,3,8,5,8,1,6,5,3,3,3,5,59,0],[2,0,0,0,0,0,0,7,0,0,0,0,9,0],[3,0,5,4,0,3,4,5,4,0,3,5,36,0],[2,3,3,5,4,0,0,5,4,6,0,5,36,0]];
		
		this.categories = {
			"Cereals": ["cereal", "kellog"],
			"Bakery": ["bread"],
			"Meats": ["chicken", "ribs", "steak"],
			"Poultry": ["chicken"],
			"Fish": ["salmon"],
			"Eggs": ["egg"],
			"Dairy": ["milk", "cheese", "cream cheese", "yogurt"],
			"Fruits": ["apple", "apples", "banana", "bananas", "orange", "oranges", "pear", "pears"],
			"Vegetables": ["broccoli", "cabbage", "lettuce", "tomatoes", "carrots"],
			"Sugars/sweets": ["cake", "ice cream", "soda", "pie"],
			"Fats/Oils": ["canola", "olive", "almond"],
			"Grains": ["bread", "rice"]
		};
	}
	
	analyze(cat1: string, cat2: string, items: Item[], done: AsyncResultCallback<string>) {
		let send = {
			"Inputs": {
				"input1": {
					"ColumnNames": [
						"Cereals",
						"Bakery",
						"Meats",
						"Poultry",
						"Fish",
						"Eggs",
						"Dairy",
						"Fruits",
						"Vegetables",
						"Sugars/sweets",
						"Fats/Oils",
						"Grains",
						"Total",
						"OB",
						"ColumnNames"
					],
					"Values": []
				}
			},
			"GlobalParameters": {}
		};
		
		for (let i = 1; i < this.sample.length; i++) {
			let row = [];
			this.sample[i].forEach((val) => {
				row.push(val.toString());
			});
			send.Inputs.input1.Values.push(row);
		}
		
		send.Inputs.input1.Values[0].push(cat1);
		send.Inputs.input1.Values[1].push(cat2);
		
		for (let i = 2; i < send.Inputs.input1.Values.length; i++) {
			send.Inputs.input1.Values[i].push("");
		}
		
		let options: request.Options = {
			method: 'POST',
			url: 'https://ussouthcentral.services.azureml.net/workspaces/185c8f460bfa4d41882444a51f9d201d/services/0b7a260d3a3c41948935977937c83f74/execute',
			qs: { 'api-version': '2.0', details: 'true' },
			headers: { authorization: 'Bearer lkfMXy/gDG87jZREhdB9cqhA55+/2xfPjCEn9OX3V/Cl1EMOiHZ5ZCyYxYKTvihFNzWaDGUgak5iDw+dzgI17A==',
			'content-type': 'application/json' },
			body: send,
			json: true
		};
		
		(<any>request).default(options, (error, response, body) => {
			done(error, JSON.stringify(body));
		});
	}
	
	fimp(items: Item[], done: AsyncResultCallback<string>) {
		let send = {
			"Inputs": {
				"input1": {
					"ColumnNames": [
						"Cereals",
						"Bakery",
						"Meats",
						"Poultry",
						"Fish",
						"Eggs",
						"Dairy",
						"Fruits",
						"Vegetables",
						"Sugars/sweets",
						"Fats/Oils",
						"Grains",
						"Total",
						"OB"
					],
					"Values": []
				}
			},
			"GlobalParameters": {}
		};
		
		for (let i = 1; i < this.sample.length; i++) {
			let row = [];
			this.sample[i].forEach((val) => {
				row.push(val.toString());
			});
			send.Inputs.input1.Values.push(row);
		}
		
		let options: request.Options = {
			method: 'POST',
			url: 'https://ussouthcentral.services.azureml.net/workspaces/185c8f460bfa4d41882444a51f9d201d/services/e104a6b2f5324ae894ff0b3886b7698f/execute',
			qs: { 'api-version': '2.0', details: 'true' },
			headers: { authorization: 'Bearer v4BGcworqAWZD5O07MhsnF/CLSPqyF6s3NWOUaPfrJaegmO0jZtSrGd4lUn5c7Ws4c6B/xMUOSRsI9TTQT43/Q==',
			'content-type': 'application/json' },
			body: send,
			json: true
		};
		
		(<any>request).default(options, (error, response, body) => {
			done(error, JSON.stringify(body));
		});
	}
	
}