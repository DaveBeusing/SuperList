/**
 * Copyright (c) 2024 Dave Beusing <david.beusing@gmail.com>
 *
 * MIT License - https://opensource.org/license/mit/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
import {Task} from './utils.js';

export default class SuperList {

	constructor( debug = false ){
		this.debug = debug;
		this.tasks = [];

		this.html = {
			input : this.$( '#sl-text-input' ),
			button : this.$( '#sl-add-button' ),
			list : this.$( '#sl-tasks' )
		};

	}
	$( element ){
		return document.querySelector( element );
	}
	run(){

		this.html.input.addEventListener( 'keydown', function( event ){
			if( event.key === 'Enter' ){
				if( this.html.input.value != '' ){
					this.createTask();
				}
				else {
					alert( 'Please write a To-Do first!' );
				}
			}
		}.bind( this ), false );


		this.html.button.addEventListener( 'click', function( event ){
			if( this.html.input.value != '' ){
				//this.addTask();
				this.createTask();
			}
			else {
				alert( 'Please write a To-Do first!' );
			}
		}.bind( this ), false );

		/*
		this.html.list.addEventListener( 'click', function( event ){
			if( event.target.tagName === 'LI' ){
				event.target.classList.toggle( 'checked' );
			}
			if( event.target.tagName === 'SPAN' ){
				event.target.parentElement.remove();
			}
			this.save();
		}.bind( this ), false );
		*/

		this.load();
		this.greet();
	}

	createID(){
		return this.tasks.length;
	}

	createTask(){
		const id = this.createID();
		const task = new Task( id, this.html.input.value );
		this.tasks.push( task );
		if( this.debug ) console.log( 'createTask::task ', task );
		//free the input element
		this.html.input.value = '';
		this.addTask( task );
	}

	addTask( task ){

		const item = document.createElement( 'div' );
			item.className = 'sl-task';
			item.id = `task-${task.id}`;

		const content = document.createElement( 'div' );
			content.className = 'sl-task-content';

		const title = document.createElement( 'span' );
			title.className = 'sl-task-title';
			title.innerHTML = ( task.title.length >= 44 ) ? task.title.substring( 0, 44 ) + '...' : task.title;

		const duration = document.createElement( 'span' );
			duration.className = 'sl-task-duration';
			duration.innerHTML = task.duration;

		content.appendChild( title );
		content.appendChild( duration );

		const controls = document.createElement( 'div' );
			controls.className = 'sl-task-controls';

		const timer = document.createElement( 'span' );
			timer.className = 'sl-task-control-timer';
			timer.innerHTML = '\u23F5';//\u23F8

		const edit = document.createElement( 'span' );
			edit.className = 'sl-task-control-edit';
			edit.innerHTML = '\u270E';

		const remove = document.createElement( 'span' );
			remove.className = 'sl-task-control-remove';
			remove.innerHTML = '\u00d7';

		controls.appendChild( timer );
		controls.appendChild( edit );
		controls.appendChild( remove );

		item.appendChild( content );
		item.appendChild( controls );

		this.html.list.appendChild( item );

		item.addEventListener( 'click', function( event ){
			const target = event.target;
			const tag = String( target.tagName ).toLowerCase();
			const name = target.className;
			console.log( 'item::event::click', tag, name );

			if( tag === 'div' && name.includes( 'sl-task' ) ){
				target.classList.toggle( 'checked' );
			}

			if( tag === 'span' && name.includes( 'sl-task-control-timer' ) ){
				if( task.interval === null ){
					this.timer.start( task );
				}
				else {
					this.timer.stop( task );
				}
			}

			if( tag === 'span' && name.includes( 'sl-task-control-remove' ) ){
				this.$( `#task-${task.id}` ).remove();
			}

			this.save();
		}.bind( this ), false );


		this.save();
	}

	timer = {
		start( task ){
			task.interval = setInterval( this.run, 1000, task );
		},
		stop( task ){
			clearInterval( task.interval );
			task.interval = null;
		},
		reset( task ){
			this.reset( task );
			task.seconds = 0;
			document.querySelector( `#task-${task.id} .sl-task-duration` ).innerHTML = '00:00:00';

		},
		run( task ){

			task.seconds++;

			let hrs = Math.floor( task.seconds / 3600 );
			let mins = Math.floor( ( task.seconds - ( hrs * 3600 ) ) / 60 );
			let secs = task.seconds % 60;

			if( secs < 10 ) secs = '0' + secs;
			if( mins < 10 ) mins = '0' + mins;
			if( hrs < 10 ) hrs = '0' + hrs;
			console.log(`${hrs}:${mins}:${secs}`);

			document.querySelector( `#task-${task.id} .sl-task-duration` ).innerHTML = `${hrs}:${mins}:${secs}`;

		}
	}



	/**
	 * 
	 */
	save(){
		//localStorage.setItem( 'SuperList', this.html.list.innerHTML );

		localStorage.setItem( 'SuperList', JSON.stringify( this.tasks ) );
	}
	/**
	 * 
	 */
	load(){
		//this.html.list.innerHTML = localStorage.getItem( 'SuperList' );

		const saved = localStorage.getItem( 'SuperList' );
		if( this.debug ) console.log( 'load::saved ', saved  );
		if( saved != null ){
			this.tasks = JSON.parse( saved );
			this.tasks.forEach( task => {
				this.addTask( task );
			});
		}

	}


	greet(){
		let weekday;
		switch( new Date().getDay() ){
			case 0:
				weekday = 'Sunday';
				break;
			case 1:
				weekday = 'Monday';
				break;
			case 2:
				weekday = 'Tuesday';
				break;
			case 3:
				weekday = 'Wednesday';
				break;
			case 4:
				weekday = 'Thursday';
				break;
			case 5:
				weekday = 'Friday';
				break;
			case 6:
				weekday = 'Saturday';
				break;
		}
		this.$( '#sl-greeting' ).innerHTML = `Hey, happy ${weekday}!`;
	}

}