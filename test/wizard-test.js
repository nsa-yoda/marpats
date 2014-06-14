/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/wizard-markup.html');

	require('bootstrap');
	require('fuelux/wizard');

	function testWizardStepStates($wizard, activeStep) {
		var $steps = $wizard.find('li');

		for(var i = 0; i < $steps.length; i++) {
			if(i === (activeStep - 1)){
				equal($steps.eq(i).hasClass('active'), true, 'step ' + activeStep + ' is active');
			}
			else if (i < (activeStep - 1)) {
				equal($steps.eq(i).hasClass('complete'), true, 'step ' + (i + 1) + ' is complete');
			}
			else {
				equal($steps.eq(i).hasClass('complete'), false, 'step ' + (i + 1) + ' is not complete');
			}
		}
	}

	module("Fuel UX Wizard");

	test("should be defined on jquery object", function () {
		ok($().wizard, 'wizard method is defined');
	});

	test("should return element", function () {
		var $wizard = $(html).find('#MyWizard');
		ok($wizard.wizard() === $wizard, 'wizard should be initialized');
	});

	test("should set step index", function () {
		var $wizard = $(html).find('#MyWizard').wizard();
		var index   = $wizard.wizard('selectedItem').step;

		// check default state
		equal(index, 1, 'default step is set');

		// move to next step
		$wizard.wizard('next');
		index = $wizard.wizard('selectedItem').step;
		equal(index, 2, 'next step is set');

		// move to previous step
		$wizard.wizard('previous');
		index = $wizard.wizard('selectedItem').step;
		equal(index, 1, 'previous step is set');
	});

	test("should fire clicked event", function () {
		var $wizard    = $(html).find('#MyWizard').wizard();
		var eventFired = false;

		$wizard.on('clicked.fu.wizard.action', function (evt, data) {
			eventFired = true;
		});

		// move to next step
		$wizard.wizard('next');

		equal(eventFired, true, 'clicked event fired');
	});

	test("should fire changed event", function () {
		var $wizard = $(html).find('#MyWizard').wizard();
		var eventFired = false;

		$wizard.on('changed.fu.wizard', function (evt, data) {
			eventFired = true;
		});

		// move to next step
		$wizard.wizard('next');
		var index = $wizard.wizard('selectedItem').step;

		equal(eventFired, true, 'changed event fired');
		equal(index, 2, 'step changed');
	});

	test("should suppress changed event", function () {
		var $wizard = $(html).find('#MyWizard').wizard();
		var eventFired = false;

		$wizard.on('clicked.fu.wizard.action', function (evt, data) {
			eventFired = true;
			return evt.preventDefault(); // prevent action
		});

		// move to next step
		$wizard.wizard('next');
		var index = $wizard.wizard('selectedItem').step;

		equal(eventFired, true, 'clicked event fired');
		equal(index, 1, 'step not changed');
	});

	test("should suppress stepclick event", function () {
		var $wizard = $(html).find('#MyWizard').wizard();
		var eventFired = false;

		$wizard.on('stepclick.fu.wizard', function (evt, data) {
			eventFired = true;
			return evt.preventDefault(); // prevent action
		});
		
		// move to second step
		$wizard.wizard('next');

		// click first step
		$wizard.find('.steps li:first').click();

		var index = $wizard.wizard('selectedItem').step;

		equal(eventFired, true, 'stepclick event fired');
		equal(index, 2, 'step not changed');
	});


	test("should fire finished event", function () {
		var $wizard = $(html).find('#MyWizard').wizard();
		var eventFired = false;

		$wizard.on('finished.fu.wizard', function (evt, data) {
			eventFired = true;
		});

		// move to next step
		$wizard.wizard('next'); // move to step2
		$wizard.wizard('next'); // move to step3
		$wizard.wizard('next'); // move to step4
		$wizard.wizard('next'); // move to step5
		$wizard.wizard('next'); // calling next method on last step triggers event

		equal(eventFired, true, 'finish event fired');
	});

	test("should change nextBtn text as appropriate", function () {
		var $wizard = $(html).find('#MyWizardWithSpaces').wizard();
		var $nextClone;

		$nextClone = $wizard.find('.btn-next').clone();
		$nextClone.children().remove();
		equal($.trim($nextClone.text()), 'Next', 'nextBtn text equal to "Next"');

		$wizard.wizard('next');
		$wizard.wizard('next');
		$wizard.wizard('next');
		$wizard.wizard('next');
		$wizard.wizard('next');
		$nextClone = $wizard.find('.btn-next').clone();
		$nextClone.children().remove();
		equal($.trim($nextClone.text()), 'Finish', 'nextBtn text equal to "Finish"');

		$wizard.wizard('previous');
		$nextClone = $wizard.find('.btn-next').clone();
		$nextClone.children().remove();
		equal($.trim($nextClone.text()), 'Next', 'nextBtn text equal to "Next"');
	});
	
	test("pass no init parameter to set current step", function () {
		var step    = 1;
		var $wizard = $(html).find('#MyWizard').wizard();

		testWizardStepStates($wizard, step);
	});

	test("pass init parameter to set current step > 1", function () {
		var step    = 3;
		var $wizard = $(html).find('#MyWizard').wizard({selectedItem:{step:step}});

		testWizardStepStates($wizard, step);
	});

	test("use selectedItem to set current step > 1", function () {
		var step = 3;
		var $wizard = $(html).find('#MyWizard').wizard();

		testWizardStepStates($wizard, 1);
 
		$wizard.wizard('selectedItem', {step:step});
 
		testWizardStepStates($wizard, step);
	});

	test( "should disabled previous steps when data attribute is present", function() {
		var step       = 3;
		var secondStep = 2;
		var $wizard = $(html).find('#MyWizardPreviousStepDisabled').wizard();

		// checking disabled property of previous button and making sure CSS class is present that removes hovers and changes cursor on previous steps
		var prevBtnDisabled   = !!$wizard.find( '.btn-prev' ).prop( 'disabled' );
		var stepsListCssClass = !!$wizard.find( '.steps' ).hasClass( 'previous-disabled' );

		testWizardStepStates( $wizard, 1 );

		// testing to see if step changes when previous step clicked on
		$wizard.wizard( 'selectedItem', { step: step } );
		$wizard.find( '.steps > li:first-child' ).click();
		var activeStepIndex = $wizard.find( '.steps > li' ).index( $wizard.find( '.steps > li.active' ) ) + 1;

		// making sure wizard can still programatically set it's own step
		$wizard.wizard( 'selectedItem', { step: secondStep } );
		var wizardSetActiveStep = $wizard.find( '.steps > li' ).index( $wizard.find( '.steps > li.active' ) ) + 1;

		// tests
		equal( prevBtnDisabled, true, 'previous step button is disabled' );
		equal( stepsListCssClass, true, 'step list has correct CSS class for disabling hovers and changing cursor' );
		equal( activeStepIndex, step, 'did not go to step when previous step clicked' );
		equal( wizardSetActiveStep, secondStep, 'can still programatically set previous step' );
	});

	/*
	test("should manage step panes", function() {
		var $wizard = $(html).wizard();
		var $step = $wizard.find('#step1');

		equal($wizard.find('#step1').hasClass('active'), true, 'active class set');
		$wizard.wizard('next');
		equal($wizard.find('#step1').hasClass('active'), false, 'active class removed');
	});
	*/

});
