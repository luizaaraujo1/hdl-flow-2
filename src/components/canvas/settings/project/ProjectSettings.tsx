import RoundedScrollContainer from '@components/shared/RoundedScrollContainer';
import SelectInput from '@components/shared/SelectInput';
import TextInput from '@components/shared/TextInput';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';
import useStoreEdges from '@store/useStoreEdges';
import useStoreNodes from '@store/useStoreNodes';
import useStorePorts from '@store/useStorePorts';
import useStoreSettings from '@store/useStoreSettings';

const LANGUAGE_OPTIONS = [
  {id: 'VDHL', value: 'VHDL'},
  {id: 'very', value: 'VERILOG (Coming soon)'},
];

function ProjectSettings() {
  const {
    projectName,
    setProjectName,
    authorName,
    setAuthorName,
    language,
    setLanguage,
  } = useStoreSettings();
  const {resetEdges} = useStoreEdges();
  const {resetPorts} = useStorePorts();
  const {resetNodes} = useStoreNodes();

  function resetEntireProject() {
    resetEdges();
    resetPorts();
    resetNodes();
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
        <div className="flex flex-col">
          <SelectInput
            id="language_select"
            label="Select HDL language"
            onTextChange={newType => setLanguage(newType)}
            value={language}
            options={LANGUAGE_OPTIONS}
          />
        </div>
      </fieldset>
      <button
        className="btn-canvas fixed bottom-10 right-14 flex bg-red-100 p-2"
        onClick={() => resetEntireProject()}>
        <ExclamationTriangleIcon />
        <h2 className="text-md ml-2 font-semibold">Reset Entire Project</h2>
      </button>
    </RoundedScrollContainer>
  );
}

export default ProjectSettings;
