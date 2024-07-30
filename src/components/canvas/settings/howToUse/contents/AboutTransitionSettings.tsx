function AboutTransitionSettings() {
  return (
    <section className="text-md flex flex-col gap-2">
      <p>
        Select a Transition that is on the <b>Canvas</b>, then click on the edit
        button that appears above it to open the <b>Transition Settings</b> for
        it.
      </p>
      <img
        alt="transition edit button"
        width="300px"
        src="/images/state_edit_button.png"
      />
      <img
        alt="transition settings"
        width="600px"
        src="/images/transition_settings.png"
      />
      <p>
        Note: The reset connection (the one that comes from the Reset Node) is
        not a transition. It&apos;s job is just to point to the initial State.
      </p>
      <p>
        A transition represents a condition for the source State to move to the
        target State in the FSM. If the logic defined here returns true, then
        the State Transition will happen on the rising edge of the FSM clock.
      </p>
      <p>Here you can:</p>
      <p>
        <b>Change Transition name:</b> This name will appear as a comment in the
        resulting code.
      </p>
      <p>
        <b>Change Transition number:</b> This will change the displayed number
        for this transition on the Canvas.
      </p>
      <p>
        <b>Select Logic Operator:</b> This selector will determine how the
        conditions will be related to each other in the resulting code. The
        &quot;All conditions must be valid&quot; option will wrap the transition
        conditions with &quot;and&quot; operators, and the &quot;At least one
        condition must be valid&quot; option will wrap them with &quot;or&quot;
        operators.
      </p>
      <p>
        <b>Add new Input Condition:</b> All your input Ports will be listed
        here, you can select which one you want to add then click the button.
      </p>
      <p>
        <b>Add new Internal Condition:</b> Same as the above, but with Internal
        Ports.
      </p>
      <p>
        Once you add a transition, you can see it listed in the Transition
        Settings body as a condition:
      </p>
      <img
        alt="condition editor"
        width="600px"
        src="/images/condition_editor.png"
      />
      <p>
        Here, you can select the type of <b>Transition Logic</b> you want to
        apply to that condition. Meaning that you will set up what circumstance
        will satisfy it.
      </p>
      <p>
        Depending on the type you choose, you might need to specify the value of
        that condition by using the editor that will automatically appear.
      </p>
      <img
        alt="port_condition"
        width="300px"
        src="/images/port_condition.png"
      />
      <p>
        If you pick the Custom logic condition, make sure to write valid HDL as
        it will be directly outputted to the resulting code.
      </p>
      <p>
        You can also <b>delete</b> a condition that you have added by clicking
        the red button on the right of it.
      </p>
    </section>
  );
}

export default AboutTransitionSettings;
