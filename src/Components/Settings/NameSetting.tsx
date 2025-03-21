import Input from "@mui/material/Input";
import style from "./NameSetting.module.scss";

interface NameSettingProps {
	value?: string;
	onChange?: (value: string | undefined) => void;
}

export const NameSetting = ({ value, onChange }: NameSettingProps) => {
	return (
		<div className={style.title}>
			<Input
				value={value}
				fullWidth
				style={{
					fontSize: 20,
				}}
				onChange={(e) => onChange?.(e.target.value)}
				className={style.input}
			/>
		</div>
	);
};
