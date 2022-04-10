App = {

	loading: false,
	contracts: {},
    
	load: async () => {
		//await App.loadWeb3()
		await App.loadAccount()
		await App.loadContract()
		await App.render()
	},


	loadAccount: async () => {

		//const accounts=await web3.eth.getAccounts();
		const accounts = await ethereum.request({ method: 'eth_accounts' });
		App.account = accounts[0]

		console.log(App.account);
	},


	loadContract: async () => {
		//var contract=require("truffle-contract")
		const todoList = await $.getJSON('TodoList.json')

		App.contracts.TodoList=TruffleContract(todoList)
		App.contracts.TodoList.setProvider(window.ethereum);
		console.log(todoList)

		// Hydrate smart contracts with values from blockchain
		App.todoList=await App.contracts.TodoList.deployed()
	},

	render: async () => {

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

	renderTasks: async () => {
		// Load tasks from blockchain
		const taskCount = await App.todoList.taskCount()
		const $taskTemplate = $('.taskTemplate')


		// Render each tasks with a new task template
		for (var i=1;i<=taskCount;i++){
			// Fetch task data from blockchain
			const task=await App.todoList.tasks(i)
			const taskId=task[0].toNumber()
			const taskContent=task[1]
			const taskCompleted=task[2]

			// Create the html for the task
			const $newTaskTemplate = $taskTemplate.clone()
			$newTaskTemplate.find('.content').html(taskContent)
			$newTaskTemplate.find('input')
							.prop('name', taskId)
							.prop('checked', taskCompleted)
							.on('click', App.toggleCompleted)
		

		// Checks if tasks is completed
		if (taskCompleted) {
			$('#completedTaskList').prepend($newTaskTemplate)
		}
		else {
			$('#taskList').prepend($newTaskTemplate)
		}


		// Show task
		$newTaskTemplate.show()

	}

	},

	createTask: async () =>{

		App.setLoading(true)	// loading screen
		const content = $('#newTask').val()
		await App.todoList.createTask(content, {from: App.account})
		window.location.reload() // to refresh page

	},

	toggleCompleted: async (e) => {
		App.setLoading(true)
    	const taskId = e.target.name
    	console.log(taskId);
    	await App.todoList.toggleCompleted(taskId, {from: App.account})
    	window.location.reload() // to refresh page
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