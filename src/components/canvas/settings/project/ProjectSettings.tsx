import RoundedScrollContainer from '@components/shared/RoundedScrollContainer';
import TextInput from '@components/shared/TextInput';
import {DownloadIcon, ExclamationTriangleIcon} from '@radix-ui/react-icons';
import useStoreEdges from '@store/useStoreEdges';
import useStoreNodes from '@store/useStoreNodes';
import useStorePorts from '@store/useStorePorts';
import useStoreSettings from '@store/useStoreSettings';
import {generateAndExportFile} from '@store/utils';

function ProjectSettings() {
  const {projectName, setProjectName, authorName, setAuthorName} =
    useStoreSettings();
  const {resetEdges, edges, transitionCount, setEdges, setTransitionCount} =
    useStoreEdges();
  const {
    resetPorts,
    inputList,
    internalsList,
    outputList,
    setInputList,
    setInternalsList,
    setOutputList,
  } = useStorePorts();
  const {resetNodes, nodes, nodeCount, setNodes, setNodeCount} =
    useStoreNodes();

  function resetEntireProject() {
    resetEdges();
    resetPorts();
    resetNodes();
  }

  function handleDownloadClick() {
    generateAndExportFile({
      edges,
      transitionCount,
      inputList,
      internalsList,
      outputList,
      nodes,
      nodeCount,
      authorName,
      projectName,
    });
  }

  function importAndReadFile(file: File) {
    const reader = new FileReader();
    reader.onload = event => {
      const state = JSON.parse(event.target?.result as string);
      if (
        (state.edges,
        state.transitionCount,
        state.inputList,
        state.internalsList,
        state.outputList,
        state.nodes,
        state.nodeCount,
        state.authorName,
        state.projectName)
      ) {
        setEdges(state.edges);
        setTransitionCount(state.transitionCount);
        setInputList(state.inputList);
        setInternalsList(state.internalsList);
        setOutputList(state.outputList);
        setNodes(state.nodes);
        setNodeCount(state.nodeCount);
        setAuthorName(state.authorName);
        setProjectName(state.projectName);
      } else {
        console.error('Failed to import file');
      }
    };
    reader.readAsText(file);
  }
  return (
    <RoundedScrollContainer>
      <fieldset className="mb-4 mr-16 grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <TextInput
            id="project_name"
            label="Project Name"
            placeholder="Give your project a name"
            onTextChange={value => setProjectName(value)}
            value={projectName}
            required
          />
        </div>
        <div className="flex flex-col">
          <TextInput
            id="author_name"
            label="Author Name"
            placeholder="Add your name to the project"
            onTextChange={value => setAuthorName(value)}
            value={authorName}
          />
        </div>
      </fieldset>
      <button
        className="btn-canvas fixed bottom-10 right-14 flex bg-red-100 p-2"
        onClick={() => resetEntireProject()}>
        <ExclamationTriangleIcon />
        <h2 className="text-md ml-2 font-semibold">Reset Entire Project</h2>
      </button>
      <div className="fixed bottom-10 left-12 flex">
        <button
          className="btn-canvas flex rounded-r-none bg-blue-100 p-2"
          onClick={handleDownloadClick}>
          <DownloadIcon />
          <h2 className="text-md ml-2 font-semibold">Export Save</h2>
        </button>
        <input
          className="btn-canvas flex rounded-l-none bg-green-100 p-2"
          type="file"
          title="Import Save"
          onChange={event => {
            const file = event.target.files ? event.target.files[0] : null;
            if (file) {
              importAndReadFile(file);
            }
          }}></input>
      </div>
    </RoundedScrollContainer>
  );
}

export default ProjectSettings;
