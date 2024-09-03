import { DeleteOutline } from "@mui/icons-material";
import {
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	ToggleButton,
	ToggleButtonGroup,
} from "@mui/material";
import { useContext, useState } from "react";
import { vscode } from "../../App";
import { WorkflowContext } from "../../Contexts/WorkflowContext";
import { NormalJob } from "../../types/workflowTypes";
import { BaseSetting } from "../Settings/BaseSetting";
import { BooleanSetting } from "../Settings/BooleanSetting";
import { ConcurrencySetting } from "../Settings/ConcurrencySetting";
import { DefaultsSetting } from "../Settings/DefaultsSetting";
import { EnvironmentSetting } from "../Settings/EnvironmentSetting";
import { NameSetting } from "../Settings/NameSetting";
import { NeedsSetting } from "../Settings/NeedsSetting";
import { NumberSetting } from "../Settings/NumberSetting";
import { ObjectSetting } from "../Settings/ObjectSetting";
import { PermissionsSetting } from "../Settings/PermissionsSetting";
import { RunsOnSetting } from "../Settings/RunsOnSetting";
import { StringSetting } from "../Settings/StringSetting";
import YamlEditor from "../UI/YAMLEditor";
import style from "./Job.module.scss";

interface JobSettingsProps {
	job: NormalJob;
	id: string;
	onClose: () => void;
}

export const JobSettings = ({ job, id, onClose }: JobSettingsProps) => {
	const { workflow, setWorkflow, setWorkflowChanged } =
		useContext(WorkflowContext);
	const [settingType, setSettingType] = useState("basic");
	const [yamlEditor, setYamlEditor] = useState(false);
	const [currentJob, setCurrentJob] = useState(job);

	if (!currentJob || !id) {
		return <></>;
	}

	const onClick = () => {
		if (!workflow) {
			return;
		}

		const newWorkflow = {
			...workflow,
			jobs: {
				...workflow.jobs,
				[id]: currentJob,
			},
		};

		setWorkflow?.(newWorkflow);

		setWorkflowChanged?.((prev) => [
			...prev,
			{
				change: newWorkflow,
				message: `${currentJob.name} successfully updated`,
			},
		]);
	};

	const removeJob = () => {
		setWorkflow?.((prev) => {
			if (!prev) {
				return prev;
			}

			const { [id]: _, ...rest } = prev.jobs;

			const newWorkflow = {
				...prev,
				jobs: { ...rest },
			};

			setWorkflowChanged?.((prev) => [
				...prev,
				{
					change: newWorkflow,
					message: `${currentJob.name} successfully removed`,
				},
			]);

			return newWorkflow;
		});

		onClose();
	};

	const updateCurrentJob = (key: string, value: any) => {
		setCurrentJob((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const basicSettings = [
		{
			id: "basic",
			name: "If",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="If"
					settingDetails='Prevents a job from running unless a condition is met. You can use any supported context and expression to create a conditional. For more information on which contexts are supported in this key, see "Contexts."'
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<StringSetting
						value={currentJob["if"]}
						name="If"
						onChange={(value) => updateCurrentJob("if", value)}
					/>
				</BaseSetting>
			),
		},
		{
			id: "basic",
			name: "Timeout",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Timeout"
					settingDetails="The maximum number of minutes to let a job run before GitHub automatically cancels it. Default: 360"
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<NumberSetting
						value={currentJob["timeout-minutes"]}
						onChange={(value) => updateCurrentJob("timeout-minutes", value)}
					/>
				</BaseSetting>
			),
		},
		{
			id: "basic",
			name: "Needs",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Needs"
					settingDetails="Identifies any jobs that must complete successfully before this job will run. If a job fails or is skipped, all jobs that need it are skipped unless the jobs use a conditional expression that causes the job to continue. If a run contains a series of jobs that need each other, a failure or skip applies to all jobs in the dependency chain from the point of failure or skip onwards."
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<NeedsSetting
						value={currentJob.needs}
						currentJob={id}
						onChange={(value) => updateCurrentJob("needs", value)}
					/>
				</BaseSetting>
			),
		},

		{
			id: "basic",
			name: "Runs on",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Runs on"
					settingDetails="Defines the type of machine to run the job on. You can specify custom runners by typing in your runner and pressing enter."
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<RunsOnSetting
						value={currentJob["runs-on"]}
						name="Runs on"
						onChange={(value) => updateCurrentJob("runs-on", value)}
					/>
				</BaseSetting>
			),
		},
		{
			id: "basic",
			name: "Uses",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Uses"
					settingDetails="The location and version of a reusable workflow file to run as a job. Use one of the following syntaxes:
{owner}/{repo}/.github/workflows/{filename}@{ref} for reusable workflows in public and private repositories.
./.github/workflows/{filename} for reusable workflows in the same repository.
"
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<StringSetting
						value={currentJob.uses}
						name="Uses"
						onChange={(value) => updateCurrentJob("uses", value)}
					/>
				</BaseSetting>
			),
		},
		{
			id: "basic",
			name: "Continue on error",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Continue on error"
					settingDetails="Prevents a workflow run from failing when a job fails. Set to true to allow a workflow run to pass when this job fails."
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<BooleanSetting
						value={currentJob["continue-on-error"]}
						onChange={(value) => updateCurrentJob("continue-on-error", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const permissionSettings = [
		{
			id: "permissions",
			name: "Permissions",
			render: (hide: boolean) => (
				<BaseSetting style={{ display: hide ? "inline-table" : "none" }}>
					<PermissionsSetting
						value={currentJob.permissions}
						onChange={(value) => updateCurrentJob("permissions", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const withSettings = [
		{
			id: "with",
			name: "With",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="With"
					settingDetails="When a job is used to call a reusable workflow, you can use with to provide a map of inputs that are passed to the called workflow. Any inputs that you pass must match the input specifications defined in the called workflow."
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<ObjectSetting
						value={currentJob.with}
						name="With"
						onChange={(value) => updateCurrentJob("with", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const defaultsSettings = [
		{
			id: "defaults",
			name: "Defaults",
			render: (hide: boolean) => (
				<BaseSetting style={{ display: hide ? "inline-table" : "none" }}>
					<DefaultsSetting
						value={currentJob.defaults}
						name="Defaults"
						onChange={(value) => updateCurrentJob("defaults", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const advancedSettings = [
		{
			id: "strategy",
			name: "Strategy",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Strategy"
					settingDetails="A matrix strategy lets you use variables in a single job definition to automatically create multiple job runs that are based on the combinations of the variables"
					style={{ display: hide ? "inline-table" : "none" }}
				></BaseSetting>
			),
		},
	];

	const envSettings = [
		{
			id: "env",
			name: "Env",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Env"
					settingDetails="A map of variables that are available to all steps in the job. You can set variables for the entire workflow or an individual step. For more information, see env and jobs.<job_id>.steps[*].env."
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<ObjectSetting
						value={currentJob.env}
						name="Env"
						onChange={(value) => updateCurrentJob("env", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const environmentSettings = [
		{
			id: "environment",
			name: "Environment",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Environment"
					settingDetails='Used to define the environment that the job references. All environment protection rules must pass before a job referencing the environment is sent to a runner. For more information, see "Using environments for deployment."'
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<EnvironmentSetting
						value={currentJob["environment"]}
						onChange={(value) => updateCurrentJob("environment", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const outputSettings = [
		{
			id: "outputs",
			name: "Outputs",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Outputs"
					settingDetails="Used to create a map of outputs for a job. Job outputs are available to all downstream jobs that depend on this job. For more information on defining job dependencies, see jobs.<job_id>.needs."
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<ObjectSetting
						value={currentJob.outputs}
						name="Outputs"
						onChange={(value) => updateCurrentJob("outputs", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const concurrencySettings = [
		{
			id: "concurrency",
			name: "Concurrency",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Concurrency"
					settingDetails='Used to ensure that only a single job or workflow using the same concurrency group will run at a time. Allowed expression contexts: github, inputs, vars, needs, strategy, and matrix. For more information about expressions, see "Expressions."'
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<ConcurrencySetting
						value={currentJob["concurrency"]}
						onChange={(value) => updateCurrentJob("concurrency", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const allSettings = [
		...basicSettings,
		...permissionSettings,
		...withSettings,
		...envSettings,
		...environmentSettings,
		...outputSettings,
		...advancedSettings,
		...defaultsSettings,
		...concurrencySettings,
	];

	const { steps: _, ...currentJobWithoutSteps } = currentJob;

	return (
		<div className={style.container} key={id}>
			<div className={style.sidebar}>
				<ToggleButtonGroup
					color="primary"
					value={yamlEditor ? "android" : "web"}
					exclusive
					onChange={(_, value) => setYamlEditor(value === "android")}
					aria-label="Platform"
					fullWidth
				>
					<ToggleButton value="web">UI</ToggleButton>
					<ToggleButton value="android">YAML</ToggleButton>
				</ToggleButtonGroup>
				<List>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("basic")}
							selected={settingType === "basic"}
						>
							<ListItemText primary="Basic" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("permissions")}
							selected={settingType === "permissions"}
						>
							<ListItemText primary="Permissions" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("with")}
							selected={settingType === "with"}
						>
							<ListItemText primary="With" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("env")}
							selected={settingType === "env"}
						>
							<ListItemText primary="Env" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("environment")}
							selected={settingType === "environment"}
						>
							<ListItemText primary="Environment" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("concurrency")}
							selected={settingType === "concurrency"}
						>
							<ListItemText primary="Concurrency" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("outputs")}
							selected={settingType === "outputs"}
						>
							<ListItemText primary="Outputs" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("defaults")}
							selected={settingType === "defaults"}
						>
							<ListItemText primary="Defaults" />
						</ListItemButton>
					</ListItem>
				</List>
			</div>
			<div className={style.main}>
				<div className={style.header}>
					<NameSetting
						value={currentJob.name}
						onChange={(value) => updateCurrentJob("name", value)}
					/>
					<IconButton
						edge="start"
						aria-label="settings"
						title="Delete"
						onClick={(e) => {
							if (vscode) {
								vscode.postMessage({
									action: "deleteJob",
									id,
								});
							} else {
								const response = window.confirm(
									`Are you sure you want to remove the ${currentJob.name} job?`,
								);
								if (response) {
									removeJob();
								}
							}
						}}
						sx={{
							marginLeft: "0px",
							marginRight: 1,
							marginTop: 1,
							marginBottom: 1,
						}}
					>
						<DeleteOutline />
					</IconButton>
				</div>
				<div className={style.settingsContainer}>
					{yamlEditor ? (
						<YamlEditor
							word={settingType}
							value={currentJobWithoutSteps as NormalJob}
							onChange={(value: any) =>
								setCurrentJob({ ...value, steps: job.steps })
							}
						/>
					) : (
						allSettings.map((setting) =>
							setting?.render(settingType === setting.id),
						)
					)}
				</div>
				<button className={style.saveButton} onClick={onClick}>
					Save
				</button>
			</div>
		</div>
	);
};
