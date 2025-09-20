import {
  useRef,
  useState,
  useEffect,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useForm, type SubmitHandler } from "react-hook-form";

const MODAL_TITLE = "modal-title";
const MODAL_DESCRIPTION = "modal-description";
const ERROR_NAME = "error-name";
const ERROR_EMAIL = "error-email";
const ERROR_EXPERIENCE = "error-experience";
const ERROR_GITHUB = "error-github";

const focusVisible = css`
  &:focus-visible {
    outline: 3px solid #4a90e2;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const ModalPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const OpenModalButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3a7bc8;
  }

  ${focusVisible}
`;

const ModalOverlay = styled.dialog`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  /* dialog 요소의 기본 스타일 재설정 */
  width: 100%;
  height: 100vh;
  max-width: 100%;
  max-height: 100vh;
  padding: 0;
  margin: 0;
  border: none;

  /* dialog 배경색 처리 */
  &::backdrop {
    background-color: transparent;
  }
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
  position: relative;

  ${focusVisible}
`;

const ModalDescription = styled.p`
  color: #555;
`;

const FormGroupWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;

  ${focusVisible}
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  background-color: white;

  ${focusVisible}
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const buttonStyle = css`
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  ${focusVisible}
`;

const CancelButton = styled.button`
  background-color: #e0e0e0;
  border: none;
  color: #333;
  ${buttonStyle}
`;

const SubmitButton = styled.button`
  background-color: #086ee2;
  border: none;
  color: white;
  ${buttonStyle}
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 0;
`;

interface FormData {
  name: string;
  email: string;
  experience: string;
  github?: string;
}

const ModalFormPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const modalTitleRef = useRef<HTMLHeadingElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      experience: "",
      github: "",
    },
  });

  const openModal = () => {
    setIsModalOpen(true);
    modalRef.current?.showModal();
    reset();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    modalRef.current?.close();
  };

  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  const handleOverlayClick = (event: ReactMouseEvent) => {
    /*dialog 요소는 backdrop 클릭을 자동으로 감지하지 않으므로 수동으로 처리*/
    if (modalRef.current === event.target) {
      closeModal();
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("제출된 데이터:", data);
    closeModal();
  };

  useEffect(() => {
    if (isModalOpen) {
      modalTitleRef.current?.focus();

      const handleTabKey = (e: globalThis.KeyboardEvent) => {
        if (e.key === "Tab" && modalContentRef.current) {
          /**focus trap 만들기 */
          const focusableElements =
            modalContentRef.current.querySelectorAll<HTMLElement>(
              '[tabindex="0"], [href], input, select, button'
            );

          const focusableArray = Array.from(focusableElements);
          const firstElement = focusableArray[0];
          const lastElement = focusableArray[focusableArray.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener("keydown", handleTabKey);
      return () => {
        document.removeEventListener("keydown", handleTabKey);
      };
    } else {
      openButtonRef.current?.focus();
    }
  }, [isModalOpen]);

  return (
    <ModalPage>
      <OpenModalButton ref={openButtonRef} onClick={openModal}>
        🚀 신청 폼 작성하기
      </OpenModalButton>

      {isModalOpen && (
        <ModalOverlay
          ref={modalRef}
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
          aria-labelledby={MODAL_TITLE}
          aria-describedby={MODAL_DESCRIPTION}
        >
          <ModalContent
            ref={modalContentRef}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalTitle id={MODAL_TITLE} ref={modalTitleRef} tabIndex={0}>
              신청 폼
            </ModalTitle>
            <ModalDescription id={MODAL_DESCRIPTION}>
              이메일과 FE 경력 연차 등 간단한 정보를 입력해주세요.
            </ModalDescription>

            <FormGroupWrapper onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label htmlFor="name">이름 / 닉네임</Label>
                <Input
                  id="name"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? ERROR_NAME : undefined}
                  {...register("name", {
                    required: "이름을 입력해주세요",
                    minLength: {
                      value: 2,
                      message: "최소 2글자 이상 입력해주세요",
                    },
                  })}
                />
                {errors.name && (
                  <ErrorMessage
                    id={ERROR_NAME}
                    role="alert"
                    aria-live="assertive"
                  >
                    {errors.name.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? ERROR_EMAIL : undefined}
                  {...register("email", {
                    required: "이메일을 입력해주세요",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "올바른 이메일 형식으로 입력해주세요",
                    },
                  })}
                />
                {errors.email && (
                  <ErrorMessage
                    id="error-email"
                    role="alert"
                    aria-live="assertive"
                  >
                    {errors.email.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="experience">FE 경력 연차</Label>
                <Select
                  id="experience"
                  aria-invalid={errors.experience ? "true" : "false"}
                  aria-describedby={
                    errors.experience ? ERROR_EXPERIENCE : undefined
                  }
                  {...register("experience", {
                    required: "FE 경력 연차를 선택해주세요",
                  })}
                >
                  <option value="" disabled>
                    선택해주세요
                  </option>
                  <option value="0-3">0-3년차</option>
                  <option value="4-7">4-7년차</option>
                  <option value="8+">8년차 이상</option>
                </Select>
                {errors.experience && (
                  <ErrorMessage
                    id={ERROR_EXPERIENCE}
                    role="alert"
                    aria-live="assertive"
                  >
                    {errors.experience.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="github">Github 링크 (선택)</Label>
                <Input
                  type="url"
                  id="github"
                  name="github"
                  placeholder="https://github.com/username"
                  aria-invalid={errors.github ? "true" : "false"}
                  aria-describedby={errors.github ? ERROR_GITHUB : undefined}
                  {...register("github", {
                    pattern: {
                      value:
                        /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?.*$/,
                      message: "올바른 Github URL 형식으로 입력해주세요",
                    },
                  })}
                />
                {errors.github && (
                  <ErrorMessage
                    id={ERROR_GITHUB}
                    role="alert"
                    aria-live="assertive"
                  >
                    {errors.github.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormActions>
                <CancelButton type="button" onClick={closeModal}>
                  취소
                </CancelButton>
                <SubmitButton type="submit">제출하기</SubmitButton>
              </FormActions>
            </FormGroupWrapper>
          </ModalContent>
        </ModalOverlay>
      )}
    </ModalPage>
  );
};

export default ModalFormPage;
