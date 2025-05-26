export class Result<TValue, TError> {
  private readonly _value: TValue | undefined;
  private readonly _error: TError | undefined;

  public readonly isSuccess: boolean;

  public get isFailure(): boolean {
    return !this.isSuccess;
  }

  protected constructor(
    value: TValue | undefined,
    error: TError | undefined,
    isSuccess: boolean,
  ) {
    this.isSuccess = isSuccess;
    this._value = value;
    this._error = error;
  }

  public static success<TValue, TError>(value: TValue): Result<TValue, TError> {
    return new Result<TValue, TError>(value, undefined, true);
  }

  public static failure<TValue, TError>(error: TError): Result<TValue, TError> {
    return new Result<TValue, TError>(undefined, error, false);
  }

  public get value(): TValue {
    if (!this.isSuccess) {
      throw new Error('Cannot access value on a failed result.');
    }
    return this._value as TValue;
  }

  public get error(): TError {
    if (this.isSuccess) {
      throw new Error('Cannot access error on a successful result.');
    }
    return this._error as TError;
  }

  public match<TResult>(
    onSuccess: (value: TValue) => TResult,
    onFailure: (error: TError) => TResult,
  ): TResult {
    return this.isSuccess ? onSuccess(this.value) : onFailure(this.error);
  }
}

export class ResultVoid<TError> {
  private readonly _error: TError | undefined;
  public readonly isSuccess: boolean;

  public get isFailure(): boolean {
    return !this.isSuccess;
  }

  private constructor(error: TError | undefined, isSuccess: boolean) {
    this.isSuccess = isSuccess;
    this._error = error;
  }

  public static success<TError>(): ResultVoid<TError> {
    return new ResultVoid<TError>(undefined, true);
  }

  public static failure<TError>(error: TError): ResultVoid<TError> {
    return new ResultVoid<TError>(error, false);
  }

  public get error(): TError {
    if (this.isSuccess) {
      throw new Error('Cannot access error on a successful result.');
    }
    return this._error as TError;
  }

  public match<TResult>(
    onSuccess: () => TResult,
    onFailure: (error: TError) => TResult,
  ): TResult {
    return this.isSuccess ? onSuccess() : onFailure(this.error);
  }
}
