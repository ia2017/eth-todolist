pragma solidity >=0.4.22 <0.9.0;

contract TodoList{
	uint public taskCount = 0;

	struct Task {
		uint id;
		string content;
		bool completed;

	}

	mapping(uint => Task) public tasks; // like creating an array but cant show like an array cuz its dynamic and need hash

	event TaskCreated(
		uint id,
		string content,
		bool completed

		);

	event TaskCompleted(

		uint id,
		bool completed

		);

	constructor() public{
		createTask("Ok bruh.");
	}

	function createTask(string memory _content) public {
		taskCount++;
		tasks[taskCount] = Task(taskCount,_content, false);
		emit TaskCreated(taskCount, _content, false);


	}

	function toggleCompleted(uint _id) public {
		
		Task memory _task = tasks[_id];
    	_task.completed = !_task.completed;	// Making true to false vice versa
    	tasks[_id] = _task;	// Mapping it back into tasks list
    	emit TaskCompleted(_id, _task.completed);	// emit event anytime function is called
	}

}
