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
export default class SuperList {
	/**
	 * 
	 */
	constructor( debug = false ){
		this.debug = debug;
		this.Input = this.$( '#sl-text-input' );
		this.Button = this.$( '#sl-add-button' );
		this.List = this.$( '#sl-list' );
	}
	$( element ){
		return document.querySelector( element );
	}
	/**
	 * 
	 */
	run(){
		/**
		 * 
		 */
		this.Input.addEventListener( 'keydown', function( event ){
			if( event.key === 'Enter' ){
				if( this.Input.value != '' ){
					this.addTask();
				}
				else {
					alert( 'Please write a To-Do first!' );
				}
			}
		}.bind( this ), false );
		/**
		 * 
		 */
		this.Button.addEventListener( 'click', function( event ){
			if( this.Input.value != '' ){
				this.addTask();
			}
			else {
				alert( 'Please write a To-Do first!' );
			}
		}.bind( this ), false );
		/**
		 * 
		 */
		this.List.addEventListener( 'click', function( event ){
			if( event.target.tagName === 'LI' ){
				event.target.classList.toggle( 'checked' );
			}
			if( event.target.tagName === 'SPAN' ){
				event.target.parentElement.remove();
			}
			this.save();
		}.bind( this ), false );
		/**
		 * 
		 */
		this.load();
	}
	/**
	 * 
	 */
	addTask(){
		let li = document.createElement( 'li' );
		li.innerHTML = this.Input.value;
		this.List.appendChild( li );
		let span = document.createElement( 'span' );
		span.innerHTML = '\u00d7';
		li.appendChild( span );
		this.Input.value = '';
		this.save();
	}
	/**
	 * 
	 */
	save(){
		localStorage.setItem( 'data', this.List.innerHTML );
	}
	/**
	 * 
	 */
	load(){
		this.List.innerHTML = localStorage.getItem( 'data' );
	}
}