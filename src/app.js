App = {

	contracts: {},
    loading: false,


	load: async() => {
		await App.loadWeb3()
		await App.loadAccount()
		await App.loadContract()
		await App.render()
	},

	// https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  	loadWeb3: async () => {
    	window.addEventListener('load', async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            console.log("Loaded....")
            try {
                // Request account access if needed
                await ethereum.enable();
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */});
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */});
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
        });
    },

	loadAccount: async() =>{
		//App.account=web3.eth.accounts[0];
		App.account = await ethereum.request({ method: 'eth_accounts' });

		console.log(App.account);
	},


	loadContract: async () =>{
		//var contract=require("truffle-contract")
		const todoList = await $.getJSON('TodoList.json')
		App.contracts.TodoList=TruffleContract(todoList)
		App.contracts.TodoList.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
		console.log(todoList)

		// Hydrate smart contracts with values from blockchain
		App.todoList=await App.contracts.TodoList.deployed()
	},

	render: async()=>{

		//prevent double render
		if (App.loading){
			return
		}
	

		// Update app loading state
		App.setLoading(true)

		// Render Account
		$('#account').html(App.account)

		// Render Tasks
		await App.renderTasks()

		// Update app loading state
		App.setLoading(false)

	},

	renderTasks: async() => {
		// Load tasks from blockchain
		const taskCount = await App.todoList.taskCount()
		const $taskTemplate = $('.taskTemplate')


		// Render each tasks with a new task template
		for (var i=1;i<=taskCount;i++){
			const task=await App.todoList.tasks(i)
			const taskId=task[0].toNumber()
			const taskContent=task[1]
			const taskCompleted=task[2]

			// Create the html for the task
			const $newTaskTemplate = $taskTemplate.clone()
			$newTaskTemplate.find('.content').html(taskContent)
			$newTaskTemplate.find('input')
							.prop('name',taskId)
							.prop('name',taskCompleted)
							//.on('click', App.toggleCompleted)
		

		// Checks if tasks is completed
		if (taskCompleted) {
			$('#completedTaskList').append($newTaskTemplate)
		}
		else {
			$('#taskList').append($newTaskTemplate)
		}


		// Show task
		$newTaskTemplate.show()

	}

	},

	setLoading: (boolean) => {
		App.loading = boolean
	    const loader = $('#loader')
	    const content = $('#content')
	    if (boolean) {
	      loader.show()
	      content.hide()
	    } else {
	      loader.hide()
	      content.show()
	    }
  }

}

$(() => {
	$(window).load(()=>{
		App.load()
	})
})