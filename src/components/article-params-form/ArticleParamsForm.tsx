import { ArrowButton } from 'components/arrow-button';
import { Button } from 'components/button';
import { RadioGroup } from '../radio-group';
import { Select } from '../select';
import { Separator } from '../separator';
import { Spacing } from '../spacing';
import { Text } from '../text';

import { useState, useEffect, useRef, SyntheticEvent, FormEvent } from 'react';
import {
	ArticleStateType,
	OptionType,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';
import clsx from 'clsx';

export type TArticleProps = {
	defaultArticleState: ArticleStateType;
	changeArticleState: (state: ArticleStateType) => void;
};

export type TConfigurationState = ArticleStateType & {
	opened: boolean;
};

export const ArticleParamsForm = ({
	defaultArticleState,
	changeArticleState,
}: TArticleProps) => {
	const [state, setState] = useState({ ...defaultArticleState, opened: false });
	const formRef = useRef<HTMLDivElement>(null);

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		changeArticleState(state);
		toggleOpen();
	};

	const reset = () => {
		const prev = { ...defaultArticleState, opened: false };
		setState(prev);
		changeArticleState(prev);
	};

	const changeOption = (option: OptionType, prop: keyof ArticleStateType) => {
		let modifiedState = { ...state };
		modifiedState[prop] = option;
		setState(modifiedState);
	};

	const toggleOpen = () => {
		setState((prev) => ({ ...prev, opened: !prev.opened }));
	};

	const handleClick = (e: MouseEvent) => {
		if (
			state.opened &&
			formRef.current &&
			!formRef.current.contains(e.target as Node)
		) {
			toggleOpen();
		}
	};

	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			toggleOpen();
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClick);
		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('mousedown', handleClick);
			document.removeEventListener('keydown', handleEscape);
		};
	}, [state.opened]);

	return (
		<>
			<ArrowButton opened={state.opened} onClick={toggleOpen} />
			<aside
				ref={formRef}
				className={clsx(styles.container, {
					[styles.container_open]: state.opened,
				})}>
				<form className={styles.form} onSubmit={onSubmit}>
					<Text
						children='Задайте параметры'
						as='h2'
						size={31}
						uppercase
						weight={800}
					/>
					<Spacing size={50} />
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={state.fontFamilyOption}
						onChange={(option) => changeOption(option, 'fontFamilyOption')}
					/>
					<Spacing size={50} />
					<RadioGroup
						name='Размер шрифта'
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={state.fontSizeOption}
						onChange={(option) => changeOption(option, 'fontSizeOption')}
					/>
					<Spacing size={50} />
					<Select
						title='Цвет шрифта'
						selected={state.fontColor}
						options={fontColors}
						onChange={(option) => changeOption(option, 'fontColor')}
					/>
					<Spacing size={50} />
					<Separator />
					<Spacing size={50} />
					<Select
						title='Цвет фона'
						selected={state.backgroundColor}
						options={backgroundColors}
						onChange={(option) => changeOption(option, 'backgroundColor')}
					/>
					<Spacing size={50} />
					<Select
						title='Ширина контента'
						selected={state.contentWidth}
						options={contentWidthArr}
						onChange={(option) => changeOption(option, 'contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='reset' onClick={reset} />
						<Button title='Применить' type='submit' />
					</div>
				</form>
			</aside>
		</>
	);
};
