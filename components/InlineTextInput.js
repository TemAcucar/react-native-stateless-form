import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'

const renderInput = ({ input: { onChange, ...restInput }, inputStyle, multiline, nextInput, onSubmitEditing, onFocus, onBlur, value, inheritProps}) => {
  return <TextInput 
    returnKeyType={ multiline ? 'default' : (nextInput ? 'next' : 'done') }
    onSubmitEditing={onSubmitEditing}
    onFocus={onFocus}
    onBlur={onBlur}
    value={value}
    { ...inheritProps }
    style={[{
      flex: 1,
      height: 36,
      fontSize: 14,
      backgroundColor: 'white',
    }, inputStyle]}
    onChangeText={onChange} 
    {...restInput} />
}

export default class InlineTextInput extends Component {
  componentDidMount() {
    this.scrollTo = 0
  }

  handleLayout(event) {
    this.scrollTo = event.nativeEvent.layout.y
  }

  handleFocus() {
    const { onFocus } = this.props
    onFocus && onFocus(this.scrollTo)
  }

  focus() {
    console.log('InlineTextInput::focus()');
    this.refs.input.focus()
  }

  blur() {
    console.log('InlineTextInput::blur()');
    this.refs.input.blur()
  }

  shouldDisplayMessage() {
    const { value, valid, message } = this.props
    return (value && value.length > 0 && !valid && message)
  }

  handleSubmitEditing() {
    const { nextInput, onNextInputFocus } = this.props
    onNextInputFocus && onNextInputFocus(nextInput, this)
  }

  renderIcon() {
    const { icon, validIcon, invalidIcon, valid, value, iconStyle } = this.props
    if (!icon)
      return
    let renderedIcon = null
    if (value && value.length > 0) {
      renderedIcon = (valid ? (validIcon ? validIcon : icon) : (invalidIcon ? invalidIcon : icon))
    } else {
      renderedIcon = icon
    }
    return (
      <View
        style={[{
          marginLeft: 6,
        }, iconStyle]}
      >
        {renderedIcon}
      </View>
    )
  }

  renderMessage() {
    const { message, messageStyle } = this.props
    const style = StyleSheet.flatten(this.props.style)
    if (this.shouldDisplayMessage()) {
      return(
        <View style={{
          backgroundColor: (style && style.backgroundColor ? style.backgroundColor : 'white')
        }}>
          <Text style={[{
            color: 'red',
            marginLeft: 10,
            marginBottom: 10,
            fontSize: 12,
          }, messageStyle]}>
            { message }
          </Text>
        </View>
      )
    }
  }

  render() {
    const { label, value, labelStyle, inputStyle, nextInput, onBlur, multiline, name } = this.props
    const style = StyleSheet.flatten(this.props.style)
    return (
      <View
        onLayout={this.handleLayout.bind(this)}
        style={[{
          backgroundColor: 'white',
          borderTopWidth: 0.5,
          borderBottomWidth: (nextInput ? 0 : 0.5),
          borderColor: 'lightgray',
        }, style]}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 6,
          paddingBottom: (this.shouldDisplayMessage() ? 0 : 6),
          backgroundColor: (style && style.backgroundColor ? style.backgroundColor : 'white'),
        }}>
          { this.renderIcon() }
          <Text
            style={[{
              flex: 0.5,
              fontSize: 14,
              fontWeight: 'bold',
              marginLeft: 6,
            }, labelStyle]}
          >
            {label}
          </Text>
          <Field 
            name={name} 
            inputStyle={inputStyle} 
            multiline={multiline}
            nextInput={nextInput}
            onSubmitEditing={this.handleSubmitEditing.bind(this)}
            onFocus={this.handleFocus.bind(this)}
            onBlur={onBlur}
            value={value}
            inheritProps={ { ...this.props } }
            component={renderInput} />
        </View>
        { this.renderMessage() }
      </View>
    )
  }
}

const stylePropType = PropTypes.oneOfType([
  PropTypes.object,
  PropTypes.arrayOf(PropTypes.object),
])

InlineTextInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  valid: PropTypes.bool,
  message: PropTypes.string,
  style: stylePropType,
  iconStyle: stylePropType,
  labelStyle: stylePropType,
  inputStyle: stylePropType,
  messageStyle: stylePropType,
  icon: PropTypes.element,
  validIcon: PropTypes.element,
  invalidIcon: PropTypes.element,
}

InlineTextInput.defaultProps = {
  label: 'Use label prop',
  value: null,
  valid: false,
  message: null,
  style: {},
  iconStyle: {},
  labelStyle: {},
  inputStyle: {},
  messageStyle: {},
  icon: null,
  validIcon: null,
  invalidIcon: null,
}
