function GettingStarted() {
  return (
    <section className="text-md flex flex-col gap-2">
      <p>
        In a new empty project, you will see the <b>Canvas</b> page with a{' '}
        <b>Start Node and State 0</b>.
      </p>
      <img
        alt="default state"
        width="300px"
        src="/images/default_canvas_state.png"
      />
      <p>
        Check the <b>Side Menu</b> that contains all the important features that
        you can use to set up your project.
      </p>
      <img alt="side menu" width="150px" src="/images/side_menu.png" />
      <p>
        The first thing you should do in a brand new project is going to the
        <b> Port Editor</b> to add all the <b>Ports</b> (third button on the
        menu, top to bottom) that are relevant to the FSM you want to create.
        You can add <b>Input, Output and Internal</b> type Ports and they will
        be automatically added to all the States that you create from then on.
      </p>
      <img
        alt="side menu port editor"
        width="150px"
        src="/images/side_menu_port_editor.png"
      />
      <img alt="port editor" width="600px" src="/images/port_editor.png" />
      <p>
        (Check the <b>About: Port Settings</b> section in <b>How to Use</b> for
        more details about this component)
      </p>
      <p>
        With all your Ports set up, you can drag all of the desired
        <b> States </b>
        into the <b>Canvas</b> (click and drag the fourth icon of the side menu,
        top to bottom, and release it on the Canvas to create a new State). All
        states that you add should be <b>uniquely numbered</b>, fortunately the
        default number will increment automatically. You can change it on the{' '}
        <b>State Editor</b> later!
      </p>
      <img
        alt="port editor add state"
        width="150px"
        src="/images/side_menu_new_state.png"
      />
      <img
        alt="port editor drag start"
        width="300px"
        src="/images/add_state_drag_start.png"
      />
      <img
        alt="port editor drag"
        width="300px"
        src="/images/add_state_drag.png"
      />
      <img
        alt="port editor drag end"
        width="300px"
        src="/images/add_state_drag_end.png"
      />
      <p>
        Now you can connect your FSM States with <b>Transitions</b>, click and
        <b> drag the highlighted area</b> in the bottom of them, and then
        connect the resulting line to other states, or to itself, to add a
        Transition.
      </p>
      <img
        alt="transition connect start"
        width="300px"
        src="/images/transition_connect_start.png"
      />
      <img
        alt="transition connect"
        width="300px"
        src="/images/transition_connect.png"
      />
      <img
        alt="transition connect end"
        width="300px"
        src="/images/transition_connect_end.png"
      />
      <p>
        Make sure to always connect the <b>Start State</b> to any State to
        determine the initial State of your FSM, as it will not be correct
        without it! Every FSM in HDL Flow needs to have this connection.
      </p>
      <img
        alt="start connected"
        width="300px"
        src="/images/start_connected.png"
      />
      <p>
        The next step is setting up the <b>State Logic</b> inside all the States
        you created, you can click any <b>State</b> in the Canvas to make the{' '}
        <b>Edit</b> button appear, click it to open the <b>State Editor</b> to
        set up the value the Ports will assume when the FSM reaches that State.
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
      <p>
        (Check the <b>About: State Settings</b> section in <b>How to Use</b> for
        more details about this component)
      </p>
      <p>
        Once that is done, you can do the same for the <b>Transitions</b> (there
        is a <b>Transition Editor </b> as well, that can be opened similarly).
        in this case the <b>Transition Logic</b> will determine what is the
        condition for a State to change to another on the rising edge of the FSM
        clock.
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
        (Check the <b>About: Transition Settings</b> section in{' '}
        <b>How to Use</b> for more details about this component)
      </p>
      <p>
        Then you might want to go to <b>Project Settings</b>, set the project
        name and your author name. You can also export the project as a file so
        that you can load it later. Theres is a button here that you can use to
        clear the project and start over.
      </p>
      <img
        alt="side menu project settings"
        width="150px"
        src="/images/side_menu_project_settings.png"
      />
      <img
        alt="project settings"
        width="600px"
        src="/images/project_settings.png"
      />
      <p>
        (Check the <b>About: Project Settings</b> section in <b>How to Use</b>{' '}
        for more details about this component)
      </p>
      <p>
        Finally it is time to check your results! Check the <b>Code Results</b>{' '}
        menu to see the generated HDL code. There is a button here you can use
        to easily copy all of the code, and this component will{' '}
        <b>automatically update</b> if you make any changes to the Canvas.
      </p>
      <img
        alt="side menu code results"
        width="150px"
        src="/images/side_menu_code_results.png"
      />
      <img alt="code results" width="600px" src="/images/code_results.png" />
      <p>
        (Check the <b>About: Code Results</b> section in <b>How to Use</b> for
        more details about this component)
      </p>
    </section>
  );
}

export default GettingStarted;
