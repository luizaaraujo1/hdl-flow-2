function AboutStateSettings() {
  return (
    <section className="text-md flex flex-col gap-2">
      <p>
        Select a State that is on the <b>Canvas</b>, then click on the edit
        button that appears above it to open the <b>State Settings</b> for it.
      </p>
      <img
        alt="state edit button"
        width="300px"
        src="/images/state_edit_button.png"
      />
      <img
        alt="state settings"
        width="600px"
        src="/images/state_settings.png"
      />
      <p>Here you can:</p>
      <p>
        <b>Change State name:</b> This name will appear as a comment in the
        resulting code.
      </p>
      <p>
        <b>Change State number:</b> This number will be important to identify
        the state in the resulting code, so make sure that every State in your
        project has a unique number!
      </p>
      <p>
        Once you add Ports to your project, the <b>Internal and Output</b> ports
        will appear here so that you can set the value for them when the FSM
        reaches this state.
      </p>
      <img
        alt="state settings operations"
        width="600px"
        src="/images/state_settings_operations.png"
      />
      <p>
        You will be able to select which type of <b>State Logic</b> will be
        applied to each Port on the State you are editing by using the port
        operation selector on the right. This will determine the value assumed
        by that port when the FSM reaches that state.
      </p>
      <p>
        If you pick the Custom logic operation, make sure to write valid HDL as
        it will be directly outputted to the resulting code.
      </p>
    </section>
  );
}

export default AboutStateSettings;
