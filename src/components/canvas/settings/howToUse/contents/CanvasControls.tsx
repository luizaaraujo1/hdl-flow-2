import ROUTE_PATHS from '@constants/routePaths';

function CanvasControls() {
  return (
    <section className="text-md flex flex-col gap-2">
      <p>
        When you are on the <b>{ROUTE_PATHS.Canvas}</b> path in <b>HDL FLow</b>,
        you will be able to see and interact with the FSM (Finite State Machine){' '}
        <b>Canvas</b>.
      </p>
      <p>
        In this section you will learn all the controls needed to create your
        very own FSM diagrams with this tool.
      </p>
      <img
        alt="default state"
        width="300px"
        src="/images/default_canvas_state.png"
      />
      <p>
        <b>-- Navigating the Canvas -- </b>
      </p>
      <p>
        <b>Viewport movement:</b> Use your mouse to click in the background of
        the <b>Canvas</b>and drag the screen around in order to move your
        viewport.
      </p>
      <p>
        <b>Zoom control:</b> Use your mouse wheel to scroll up and down to zoom
        in and out your viewport.
      </p>
      <p>
        <b>Canvas control buttons:</b> In the bottom left corner there are
        controls for the Canvas that you can also use. From top to bottom you
        have:
      </p>
      <p>-- Zoom In</p>
      <p>-- Zoom Out</p>
      <p>
        -- Center viewport (Will reposition the screen so that you can see all
        of it&apos;s contents at once)
      </p>
      <p>
        -- Editing lock (Will disable/enable editing for all the elements in the
        Canvas)
      </p>
      <img
        alt="canvas controls"
        width="150px"
        src="/images/canvas_controls.png"
      />
      <p>
        <b>Move elements</b> All elements ( besides the <b>Reset Node</b> ) can
        be moved by clicking and dragging them on the Canvas. Use this to
        position them as you see fit.
      </p>
      <p>
        <b>Delete elements:</b> You are able to delete some elements of the
        Canvas. You can do that by selecting them and typing the Shift or Delete
        key in you keyboard, or you can click the Delete button that appears
        above them when they are selected.
      </p>
      <p>
        <b>Create States:</b> You can click and drag the fourth option on the
        side menu to the Canvas in order to create a new State node in it.
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
        <b>Create transition:</b> You can create transitions between different
        states by on the highlighted area and dragging it to where to the
        corresponding area in a different state.
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
        <b>Create a self referencing transition:</b> Sometimes you want a FSM
        state to have a specific condition where it will loop into itself, you
        can add that loop transition by clicking the highlighted area and
        dragging it to it&apos;s center, and then releasing it.
      </p>
      <img
        alt="transition connect start"
        width="300px"
        src="/images/transition_connect_start.png"
      />
      <img
        alt="transition connect self"
        width="300px"
        src="/images/transition_connect_self.png"
      />
      <img
        alt="transition connect self end"
        width="300px"
        src="/images/transition_connect_self_end.png"
      />
      <p>
        <b>Edit a transition:</b> By clicking right below a State that has an
        incoming connection, you will be able to drag it around and place it
        somewhere else (If you leave it disconnected, it will be deleted)
      </p>
      <img
        alt="transition edit start"
        width="300px"
        src="/images/transition_edit_start.png"
      />
      <img
        alt="transition edit"
        width="300px"
        src="/images/transition_edit.png"
      />
      <img
        alt="transition edit end"
        width="300px"
        src="/images/transition_edit_end.png"
      />
      <p>
        <b>Transition rules:</b> There are some <b>rules</b> that will be
        enforced by HDL Flow when creating transitions.
      </p>
      <p>
        -- Only one Transition per State: A State can only connect to another
        (or to itself) one time.
      </p>
      <p>
        -- The Reset Node can only have one connection: There can only be one
        initial state on your FSM, so you will not be able to create multiple
        connections with it. If you want to change this connection then you can
        Edit it, or Delete it first and then create another one pointing
        somewhere else.
      </p>
      <p>
        -- States cannot connect to the Reset Node: You will not be able to
        connect any States to the <b>Reset Node</b>.
      </p>
    </section>
  );
}

export default CanvasControls;
