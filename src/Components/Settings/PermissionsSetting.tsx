import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Info } from "react-feather";
import { Permissions } from "../../types/workflowTypes";
import { BootstrapTooltip } from "./BaseSetting";
import style from "./PermissionsSetting.module.scss";

interface PermissionsSettingProps {
	value?: Permissions;
	onChange?: (value: Permissions | undefined) => void;
}

export const PermissionsSetting = ({
	value,
	onChange,
}: PermissionsSettingProps) => {
	return (
		<div>
			<PermissionSetting
				permissionName="Actions"
				permissionDetails='Work with GitHub Actions. For example, actions: write permits an action to cancel a workflow run. For more information, see "Permissions required for GitHub Apps."'
				value={value?.["actions"]}
				onChange={(permission) => onChange?.({ ...value, actions: permission })}
			/>
			<PermissionSetting
				permissionName="Attestations"
				permissionDetails='Work with artifact attestations. For example, attestations: write permits an action to generate an artifact attestation for a build. For more information, see "Using artifact attestations to establish provenance for builds"'
				value={value?.["attestations"]}
				onChange={(permission) =>
					onChange?.({ ...value, attestations: permission })
				}
			/>
			<PermissionSetting
				permissionName="Checks"
				permissionDetails='Work with check runs and check suites. For example, checks: write permits an action to create a check run. For more information, see "Permissions required for GitHub Apps."'
				value={value?.["checks"]}
				onChange={(permission) => onChange?.({ ...value, checks: permission })}
			/>
			<PermissionSetting
				permissionName="Contents"
				permissionDetails='Work with the contents of the repository. For example, contents: read permits an action to list the commits, and contents:write allows the action to create a release. For more information, see "Permissions required for GitHub Apps."'
				value={value?.["contents"]}
				onChange={(permission) =>
					onChange?.({ ...value, contents: permission })
				}
			/>
			<PermissionSetting
				permissionName="Deployments"
				permissionDetails='Work with deployments. For example, deployments: write permits an action to create a new deployment. For more information, see "Permissions required for GitHub Apps."'
				value={value?.["deployments"]}
				onChange={(permission) =>
					onChange?.({ ...value, deployments: permission })
				}
			/>
			<PermissionSetting
				permissionName="Discussions"
				permissionDetails='Work with GitHub Discussions. For example, discussions: write permits an action to close or delete a discussion. For more information, see "Using the GraphQL API for Discussions."'
				value={value?.["discussions"]}
				onChange={(permission) =>
					onChange?.({ ...value, discussions: permission })
				}
			/>
			<PermissionSetting
				permissionName="ID token"
				permissionDetails='	Fetch an OpenID Connect (OIDC) token. This requires id-token: write. For more information, see "About security hardening with OpenID Connect"'
				value={value?.["id-token"]}
				onChange={(permission) =>
					onChange?.({ ...value, "id-token": permission })
				}
			/>
			<PermissionSetting
				permissionName="Issues"
				permissionDetails='Work with issues. For example, issues: write permits an action to add a comment to an issue. For more information, see "Permissions required for GitHub Apps."'
				value={value?.["issues"]}
				onChange={(permission) => onChange?.({ ...value, issues: permission })}
			/>
			<PermissionSetting
				permissionName="Packages"
				permissionDetails='	Work with GitHub Packages. For example, packages: write permits an action to upload and publish packages on GitHub Packages. For more information, see "About permissions for GitHub Packages."'
				value={value?.["packages"]}
				onChange={(permission) =>
					onChange?.({ ...value, packages: permission })
				}
			/>
			<PermissionSetting
				permissionName="Pages"
				permissionDetails='Work with GitHub Pages. For example, pages: write permits an action to request a GitHub Pages build. For more information, see "Permissions required for GitHub Apps."'
				value={value?.["pages"]}
				onChange={(permission) => onChange?.({ ...value, pages: permission })}
			/>
			<PermissionSetting
				permissionName="Pull requests"
				permissionDetails='Work with pull requests. For example, pull-requests: write permits an action to add a label to a pull request. For more information, see "Permissions required for GitHub Apps."'
				value={value?.["pull-requests"]}
				onChange={(permission) =>
					onChange?.({ ...value, "pull-requests": permission })
				}
			/>
			<PermissionSetting
				permissionName="Repository projects"
				permissionDetails='Work with GitHub projects (classic). For example, repository-projects: write permits an action to add a column to a project (classic). For more information, see "Permissions required for GitHub Apps."'
				value={value?.["repository-projects"]}
				onChange={(permission) =>
					onChange?.({ ...value, "repository-projects": permission })
				}
			/>
			<PermissionSetting
				permissionName="Security events"
				permissionDetails='Work with GitHub code scanning and Dependabot alerts. For example, security-events: read permits an action to list the Dependabot alerts for the repository, and security-events: write allows an action to update the status of a code scanning alert. For more information, see "Repository permissions for "Code scanning alerts"" and "Repository permissions for "Dependabot alerts"" in "Permissions required for GitHub Apps."'
				value={value?.["security-events"]}
				onChange={(permission) =>
					onChange?.({ ...value, "security-events": permission })
				}
			/>
			<PermissionSetting
				permissionName="Statuses"
				permissionDetails='Work with commit statuses. For example, statuses:read permits an action to list the commit statuses for a given reference. For more information, see "Permissions required for GitHub Apps."'
				value={value?.["statuses"]}
				onChange={(permission) =>
					onChange?.({ ...value, statuses: permission })
				}
			/>
		</div>
	);
};

interface PermissionSettingProps {
	permissionName: string;
	permissionDetails?: string;
	value?: string;
	onChange: (value: "none" | "read" | "write") => void;
}

const PermissionSetting = ({
	value,
	permissionName,
	permissionDetails,
	onChange,
}: PermissionSettingProps) => {
	return (
		<div className={style.container}>
			<div className={style.permissionNameContainer}>
				<div className={style.permissionName}>{permissionName}</div>
				{permissionDetails && (
					<BootstrapTooltip title={permissionDetails} placement="right">
						<Info size={15} />
					</BootstrapTooltip>
				)}
			</div>
			<ToggleButtonGroup
				value={value}
				exclusive
				onChange={(_, value) => {
					onChange(value);
				}}
				aria-label="permission"
			>
				<ToggleButton value="none" aria-label="none" color="error">
					None
				</ToggleButton>
				<ToggleButton value="read" aria-label="read" color="warning">
					Read
				</ToggleButton>
				<ToggleButton value="write" aria-label="write" color="success">
					Write
				</ToggleButton>
			</ToggleButtonGroup>
		</div>
	);
};
